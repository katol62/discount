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
        db.query('SELECT * from tariff WHERE id = ?', [id], function (err, rows) {
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

        console.log('== CREATE TARIFF ==');
        console.log('organization='+organization);
        console.log('== END CREATE TARIFF ==');

        db.query('INSERT INTO tariff (name, start, end, type, discount, organization, owner) SELECT ?, ?, ?, ?, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM tariff WHERE name = ? AND type = ? AND organization = ?) LIMIT 1', [tname, start, end, type, discount, organization, owner, tname, type, organization], function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    update: function(id, body, done) {

        var tname = body.name;
        var start = body.start ? body.start : null;
        var end = body.end ? body.end : null;
        var type = body.type;
        var discount = body.discount;
        var owner = body.owner;
        var soft = body.soft ? '1' : '0';

        console.log('---')
        console.log(body)
        console.log(soft)
        console.log('---')

        db.query('UPDATE tariff SET name = ?, start = ?, end = ?, type = ?, discount= ?, owner = ?, soft = ? WHERE id = ?', [tname, start, end, type, discount, owner, soft, id], function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    delete: function (id, done) {
        db.query('DELETE t.*, tr.*, c.* FROM tariff t LEFT JOIN transh tr on tr.tariff=t.id LEFT JOIN cards c ON c.tid=t.id WHERE t.id = ?', [id], function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    }
};

module.exports = Tariff;