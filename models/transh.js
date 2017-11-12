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

    generateCards: function(obj, done) {
        var oid = Number(obj.oid);
        var count = Number(obj.count);
        var tariff = Number(obj.tariff);

        db.query('SELECT cid from cards ORDER BY cid DESC LIMIT 1', function (err, rows) {
            if (err) {
                return done(err)
            }

            var start = 1;
            var qr = 'SELECT Auto_increment as ai FROM information_schema.tables WHERE table_name = \'cards\' AND table_schema=DATABASE()';
            var qr1 = 'SELECT `AUTO_INCREMENT` as `ai` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = \'discount\' AND TABLE_NAME = \'cards\'';

            db.query(qr, function(err, rows){
                if (err) {
                    console.log('============ DETECT auto increment error ==========');
                    console.log(err);
                    console.log('============ END OF DETECT auto increment error ==========');
                    return done(err);
                }
                console.log('+++++++++++++');
                console.log(rows[0]["ai"]);
                console.log('+++++++++++++');
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

                        insertArray.push([qr, card_number, oid, tariff, transh]);
                    }

                    db.query('INSERT INTO cards (qr_code, card_nb, oid, tid, transh) VALUES ?', [insertArray], function(err, rows){
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
    }
};

module.exports = Transh;