var db = require('../misc/db');
var uniqid = require('uniqid');

var Card = {

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

    deleteByTranshId: function(trid) {
        db.query('DELETE FROM cards WHERE transh = ?', [id], function(err, rows){
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    }

};


module.exports = Card;