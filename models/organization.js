var db = require('../misc/db');

var Organization = {

    getAll: function (done) {
        db.query('select s.id, s.name, s.owner, u.id as uid, u.name as uname, u.last as ulast from organization s join users u on s.owner = u.id and u.role=\'admin\'', function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    getAllByOwner: function (id, done) {
        db.query(' select s.id, s.name, s.owner, u.id as uid, u.name as uname, u.last as ulast from organization s join users u on s.owner = u.id and u.role=\'admin\' and u.id = ?', [id], function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    getById: function (id, done) {
        db.query('SELECT * from organization WHERE id = ?', [id], function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    getByOwner: function (id, done) {
        db.query('SELECT * from organization WHERE owner = ?', [id], function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    create: function(body, done) {

        var name = body.name;
        var owner = body.owner;
        var country = body.country;
        var foc = body.foc;
        var region = body.region;

        db.query('INSERT INTO organization (name, owner, country, foc, region) SELECT ?, ?, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM organization WHERE name=? AND region = ?) LIMIT 1', [name, owner, country, foc, region, name, region], function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    update: function(id, body, done) {

        var name = body.name;
        var owner = body.owner;
        var country = body.country;
        var foc = body.foc;
        var region = body.region;

        db.query('UPDATE organization SET name = ?, owner = ?, country = ?, foc = ?, region = ? WHERE id = ?', [name, owner, country, foc, region, id], function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows.affectedRows)
        })
    },
    delete: function (id, done) {
        db.query('DELETE o.*, t.*, tr.*, c.* FROM organization o LEFT JOIN tariff t ON t.organization = o.id LEFT JOIN transh tr on tr.oid=o.id LEFT JOIN cards c ON c.oid=o.id WHERE o.id = ?', id, function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    }
};

module.exports = Organization;