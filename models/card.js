var db = require('../misc/db');
var uniqid = require('uniqid');

var Card = {

    getById: function(cid, done) {

        db.query('SELECT * FROM cards WHERE cid = ?', [cid], function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },

    updateCard: function(card, done) {

        db.query('UPDATE cards SET discount = ?, type = ?, pass = ?, status = ?, lifetime = ?, servicetime = ? WHERE cid = ?', [card.discount, card.type, card.pass, card.status, card.lifetime, card.servicetime, card.cid], function(err, rows){
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },

    getByTranshId: function(trid, done) {
        db.query('SELECT * from cards WHERE transh = ?', [trid], function(err, rows){
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },
    getByTariffId: function(tid, done) {
        db.query('SELECT * from cards WHERE tid= ?', [tid], function(err, rows){
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },

    deleteByTranshId: function(trid, done) {
        db.query('DELETE FROM cards WHERE transh = ?', [id], function(err, rows){
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },

    toggleTest: function (cid, done) {
        db.query('update cards SET test = IF(test = \'0\', \'1\', \'0\') where cid = ?', [cid], function(err, rows){
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },

    addSoftToTariffName: function(qrcode, tname, done) {

        db.query('SELECT * from tariff WHERE name = ?', [tname], function(err, rows){
            if (err) {
                return done(err);
            }
            var tariff = rows[0];
            db.query('INSERT INTO cards (qr_code, oid, tid) SELECT ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM cards WHERE qr_code = ? AND oid = ? AND tid = ?) LIMIT 1', [qrcode, tariff.organization, tariff.id, qrcode, tariff.organization, tariff.id], function(err, rows){
                if (err) {
                    return done(err);
                }
                done(null, rows);
            })
        })
    }

};


module.exports = Card;