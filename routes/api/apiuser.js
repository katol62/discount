var express = require('express');
var router = express.Router();

var User = require('./../../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log('return a list of users');
    User.getAll(function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(500).json({ errors: ["Could not get users", err.body] });
        } else {
            return res.status(200).json({users: rows});
        }
    })
});

/* POST create new user. */
router.post('/', function(req, res, next) {
    console.log('create new user');
    if (req.query.name && req.query.password && req.query.role) {

        User.getByNamePassword(req.query.name, req.query.password, function(err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({ errors: ["Error getting user", err.body] });
            } else {
                if (rows.length == 0) {
                    return res.status(404).json({ errors: ["User not found"] });
                }
            }
        });

        User.create(req.query.name, req.query.password, req.query.role, function(err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({ errors: ["Could not create user", err.body] });
            } else {
                return res.status(200).json({user: {id: result.insertId}});
            }
        })
    } else {
        return res.status(400).json({error: req.query});
    }
});

/* GET get user by id. */
router.get('/:id', function(req, res, next) {
    console.log('get user by id');
    if (req.params.id) {
        User.getById(req.params.id, function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(500).json({ errors: ["Could not retrieve user", err.body] });
            } else {
                if (rows.length == 0) {
                    return res.status(404).json({ errors: ["User not found"] });
                }
                return res.status(200).json({user: rows[0]});
            }
        })
    }
});

/* PUT update user by id. */
router.put('/:id', function(req, res, next) {
    console.log('update user by id');
});

/* DELETE delete user by id. */
router.delete('/:id', function(req, res, next) {
    console.log('update user by id');
});


module.exports = router;
