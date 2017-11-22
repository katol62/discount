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


module.exports = router;
