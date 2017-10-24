var express = require('express');

var router = express.Router();

var User = require('./../../models/user');
var jwt = require('jsonwebtoken');

router.post('/auth', function(req, res, next) {
    console.log('auth');

    if (req.body.name && req.body.password) {

        User.getByNamePassword(req.body.name, req.body.password, function(err, result){
            if (err) {
                console.log(err);
                return res.status(500).json({ errors: ["Error getting user", err.body] });
            } else {
                if (rows.length == 0) {
                    return res.status(404).json({ errors: ["User not found"] });
                } else {
                    var payload = {
                        admin: user.admin,
                        role: user.role
                    };
                    var token = jwt.sign(payload, app.get('superSecret'), {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    } else {
        return res.status(400).json({error: req.query});
    }
});

module.exports = router;
