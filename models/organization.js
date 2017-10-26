var db = require('../misc/db');

var Organization = {

    getAll: function (done) {
        db.query('SELECT * from organization', function (err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    getById: function (id, done) {
        db.query('SELECT * from organization WHERE id = ?', id, function (err, rows) {
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
    create: function(name, owner, done) {
        db.query('INSERT INTO organization (name, owner) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM organization WHERE name=?) LIMIT 1', [name, owner, name], function(err, rows) {
            console.log('!===============')
            console.log(err)
            console.log(rows)
            console.log('!===============')
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },
    update: function(id, name, owner, done) {
        db.query('UPDATE organization SET name = ?, owner = ? WHERE id = ?', [name, owner, id], function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows.affectedRows)
        })
    },
    delete: function (id, done) {
        db.query('DELETE FROM organization WHERE id = ?', id, function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    }
};

module.exports = Organization;