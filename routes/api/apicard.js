var express = require('express');

var router = express.Router();

var Card = require('./../../models/card');


var config = require('./../../misc/config')

router.post('/add', function(req, res, next){
    var qrcode = req.body.qrcode;
    var tname = req.body.tname;

    if (req.body.qrcode && req.body.tname) {

        Card.addSoftToTariffName(qrcode, tname, function (err, rows) {
            if (err) {
                return res.status(500).json({ errors: ["Error adding card", err.body] });
            }
            res.json({
                success: true,
                message: 'Card has been added!'
            });
        })

    } else {
        return res.status(400).json({error: 'Wrong parameters'});
    }


});


module.exports = router;
