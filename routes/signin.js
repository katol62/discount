var express = require('express');
var config = require('./../misc/config');
var User = require('./../models/user');
var bcrypt = require('bcrypt');

var router = express.Router();

/* GET signin page. */
router.get('/', function(req, res, next) {
    res.render('signin', {
        title: 'Signin',
        loggedout: true
    });
});

router.post('/', function(req, res, next){
    //Check that the name field is not empty
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password required').notEmpty();

    req.sanitize('email').escape();
    req.sanitize('email').trim();

    var errors = req.validationErrors();
    console.log(errors);

    var sessionData = req.session;

    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        return res.render('signin', {
            title: 'Signin',
            loggedout: true,
            errors: errors
        });
    } else {

        console.log(req.body);
        User.find(req.body.email, function(err, row) {
            if (err) {
                sessionData.user = null;
                return res.render('signin', {
                    title: 'Signin',
                    loggedout: true,
                    errors: [{msg:"DB Error:"+err.code}]
                });
            } else {
                if (row.length == 0) {
                    sessionData.user = null;
                    return res.render('signin', {
                        title: 'Signin',
                        loggedout: true,
                        errors: [{msg:"User not found"}]
                    });
                } else {
                    //TODO - add bycrypt
                    console.log(row);

                    var hash = row[0]['password'];
                    bcrypt.compare(req.body.password, hash, function(err, doesMatch){
                        if (doesMatch){
                            //log him in
                            req.session.user = row[0];
                            return res.redirect('/users');
                        }else{
                            //go away
                            return res.render('signin', {
                                title: 'Signin',
                                loggedout: true,
                                errors: [{msg: "Password invalid"}]
                            });
                        }
                    });
                }
            }
        })
    }

});

module.exports = router;
