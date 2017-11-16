var db = require('../misc/db');
var uniqid = require('uniqid');

var Transh = {

    allByTariff: function(tid, done) {

        db.query('select t.id, t.oid, t.start_number, t.tariff, t.count, r.name as tariff_name, o.name as org_name from transh t left join tariff r on t.tariff=r.id left join organization o on t.oid=o.id where t.tariff = ?', [tid], function(err, rows){
            if (err) {
                return done(err);
            }
            done(null, rows)
        })
    },

    getById: function(trid, done) {
        db.query('select c.oid, c.tid, c.transh, c.type, c.service, c.status, c.lifetime, c.servicetime, t.start_number, t.count from cards c left join transh t on c.transh=t.id where t.id = ?', [trid], function(err,rows){
            if (err) {
                return done(err);
            }
            done(null, rows)
        })
    },

    generateCards: function(obj, done) {

        var oid = Number(obj.oid);
        var count = Number(obj.count);
        var tariff = Number(obj.tid);

        var type = obj.type;
        var service = obj.service;
        var status = obj.status;

        var lifetime = Number(obj.lifetime);
        var servicetime = Number(obj.servicetime);

        db.query('SELECT cid from cards ORDER BY cid DESC LIMIT 1', function (err, rows) {
            if (err) {
                return done(err)
            }

            var start = 1;
            var qr = 'SELECT Auto_increment as ai FROM information_schema.tables WHERE table_name = \'cards\' AND table_schema=DATABASE()';
            //var qr1 = 'SELECT `AUTO_INCREMENT` as `ai` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = \'discount\' AND TABLE_NAME = \'cards\'';

            db.query(qr, function(err, rows){
                if (err) {
                    console.log('============ DETECT auto increment error ==========');
                    console.log(err);
                    console.log('============ END OF DETECT auto increment error ==========');
                    return done(err);
                }
                console.log('++++++ AUTO INCREMENT +++++++');
                console.log(rows[0]["ai"]);
                console.log('++++++++++++++++++++++');
                start = rows[0]["ai"];

                db.query('INSERT INTO transh (oid, tariff, start_number, count) VALUES (?, ?, ?, ?)', [oid, tariff, start, count], function (err, rows) {
                    if (err) {
                        console.log('============ INSERT into transh error ==========');
                        console.log(err);
                        console.log('============ END OF INSERT into transh error ==========');
                        return done(err)
                    }
                    if (!rows.insertId) {
                        return done({code:'111', msg:'Transh update error'})
                    }
                    var transh = rows.insertId;
                    var insertArray = [];
                    for (var i=start; i<start+count; i++) {
                        var zero = '0000000000000000';
                        var bareOid = Number(oid)+'';
                        var limitOid = 6;
                        var bareTid = Number(tariff)+'';
                        var limitTid = 4;
                        var bareCard = i+'';
                        var limitCard = 6;

                        var nb_oid = zero.substr(bareOid.length, limitOid-bareOid.length)+bareOid;
                        var nb_tid = zero.substr(bareTid.length, limitTid-bareTid.length)+bareTid;
                        var nb_nbr = zero.substr(bareCard.length, limitCard-bareCard.length)+bareCard;

                        var card_number = nb_oid+nb_tid+nb_nbr;
                        var qr = uniqid();

                        insertArray.push([qr, card_number, oid, tariff, transh, type, service, status, lifetime, servicetime]);
                    }

                    db.query('INSERT INTO cards (qr_code, card_nb, oid, tid, transh, type, service, status, lifetime, servicetime) VALUES ?', [insertArray], function(err, rows){
                        if (err) {
                            console.log('============ INSERT into cards error ==========');
                            console.log(err);
                            console.log('============ END OF INSERT into cards error ==========');
                            return done(err)
                        }
                        return done(null, rows);
                    });

                })

            });
        })
    },

    updateCardsForTransh: function(obj, done) {
        var oid = Number(obj.oid);
        var count = Number(obj.count);
        var tariff = Number(obj.tid);

        var trid = obj.trid;
        var type = obj.type;
        var service = obj.service;
        var status = obj.status;

        console.log('+++ UPDATE CARDS ++++')
        console.log(obj)
        console.log('+++ UPDATE CARDS ++++')

        var lifetime = Number(obj.lifetime);
        var servicetime = Number(obj.servicetime);

        db.query('UPDATE cards set type = ?, service = ?, status = ?, lifetime = ?, servicetime = ? WHERE transh = ?', [type, service, status, lifetime, servicetime, trid], function(err, rows){
            if (err) {
                return done(err);
            }
            done(null, rows);
        })

    },

    delete: function(id, done) {
        console.log(id)
        var qr = 'DELETE a.*, b.* FROM transh a LEFT JOIN cards b ON b.transh = a.id WHERE a.id = ?';
        console.log(qr);
        db.query('DELETE a.*, b.* FROM transh a LEFT JOIN cards b ON b.transh = a.id WHERE a.id = ?', [id], function(err, rows){
            console.log('================')
            console.log(err)
            console.log(rows)
            console.log('================')
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },

    updateCards: function(trid, cards, done) {

        var queryFinalArray = [];
        for (var i=0; i<cards.length; i++) {
            var elm = cards[i];
            if (elm[7] === trid) {
                var qr = 'UPDATE cards SET nfs_code="'+elm[2]+'", m_code="'+elm[2]+'" WHERE cid='+elm[0]+' AND qr_code="'+elm[1]+'"';
                queryFinalArray.push(qr);
            }
        }
        var queryFinal = queryFinalArray.join(';');

        db.query(queryFinal, function(err, rows){
            console.log('== update cards =====')
            console.log(err)
            console.log(rows)
            console.log('== update cards =====')
            if (err) {
                return done(err);
            }
            done(null, rows);
        })

    }
};

module.exports = Transh;