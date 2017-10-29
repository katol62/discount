var db = require('../misc/db');

var Tariff = {

    getAll: function (done) {
        db.query('SELECT * from tariff', function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    getById: function (id, done) {
        db.query('SELECT * from tariff WHERE id = ?', id, function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    getByOwner: function (id, done) {
        db.query('SELECT * from tariff WHERE owner = ?', [id], function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    getByOrganization: function (id, done) {
        db.query('SELECT * from tariff WHERE organization = ?', [id], function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    create: function(tname, start, end, type, discount, organization, owner, done) {
        db.query('INSERT INTO tariff (name, start, end, type, discount, organization, owner) SELECT ?, ?, ?, ?, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM tariff WHERE name = ? AND type = ? AND organization = ?) LIMIT 1', [tname, start, end, type, discount, organization, owner, tname, type, organization], function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    update: function(id, tname, start, end, type, discount, owner, done) {

        db.query('UPDATE tariff SET name = ?, start = ?, end = ?, type = ?, discount= ?, owner = ? WHERE id = ?', [tname, start, end, type, discount, owner, id], function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    delete: function (id, done) {
        db.query('DELETE FROM tariff WHERE id = ?', id, function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    }
};

module.exports = Tariff;