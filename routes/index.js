var express = require('express');
var config = require('./../misc/config');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var sessionData = req.session;
    var logged = sessionData.user != undefined && sessionData.user != null;
    var user = sessionData.user ? sessionData.user : null;
    res.render('index', {
        title: 'Home',
        account: user,
        loggedout: !logged
    });
});

/* GET home page. */
router.get('/signout', function (req, res, next) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});


module.exports = router;
