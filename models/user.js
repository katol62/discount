var db = require('../misc/db');

var User = {

    getAll: function(done) {
        db.query('SELECT * from users', function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },

    getForRoles: function(roles, id, done) {
        console.log(roles+" == "+id);

        db.query('SELECT * from users WHERE parent = ? AND role IN ( ? ) ', [id, roles], function(err, rows) {
            console.log('err: '+err);
            console.log('rows: '+rows);
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },

    getByRole: function(role, done) {
        db.query('SELECT * from users WHERE role = ?', role, function(err, rows) {
            if (err) {
                return done(err)
            }
            done(null, rows)
        })
    },

    create: function(name, last, email, password, role, parent, done) {
        db.query('INSERT INTO users (name, last, email, password, role, parent) SELECT ?, ?, ?, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM users WHERE email=?) LIMIT 1', [name, last, email, password, role, parent, email], function(err, rows) {
            console.log(err);
            console.log(rows);
            if (err) {
                return done(err)
            }
            done(null, rows)
        });
    },

    updateProfile: function(id, name, last, email, password, done) {
        db.query('UPDATE users SET name = ?, last = ?, email = ?, password = ? WHERE id = ?', [name, last, email, password, id], function(err, rows) {
            console.log(err);
            console.log(rows);
            if (err) {
                return done(err)
            }
            done(null, rows.affectedRows)
        })
    },

    update: function(id, name, last, email, password, done) {
        db.query('UPDATE users SET name = ?, last = ?, email = ?, password = ? WHERE id = ?', [name, last, email, password, id], function(err, rows) {
            console.log(err);
            console.log(rows);
            if (err) {
                return done(err)
            }
            done(null, rows.affectedRows)
        })
    },
    getById: function (id, done) {
        db.query('SELECT * FROM users WHERE id = ?', [id], function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },

    delete: function (id, done) {
        db.query('DELETE FROM users WHERE id = ?', id, function(err, rows) {
            console.log('--------------');
            console.log(err);
            console.log(rows);
            console.log('--------------');
            if (err) {
                return done(err);
            }
            done(null, rows);
        })
    },
    getByNamePassword: function (name, password, done) {
        db.query('SELECT * FROM users where name = ? and password = ?', name, password, function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows)
        })

    },
    find: function (name, done) {
        console.log(name);
        db.query('SELECT * FROM users where email = ?', name, function(err, rows) {
            if (err) {
                return done(err);
            }
            done(null, rows)
        })

    }

};

module.exports = User;