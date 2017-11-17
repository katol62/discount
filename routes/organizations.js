var express = require('express');

var fs = require('fs');
var csvjson = require('csvjson');
var path = require("path");
var formidable = require('formidable');

var config = require('../misc/config');
var Organization = require('./../models/organization');
var Tariff = require('./../models/tariff');
var Transh = require('./../models/transh');
var Card = require('./../models/card');

var router = express.Router();

var methodOverride = require('method-override');
router.use(methodOverride('X-HTTP-Method-Override'));
router.use(methodOverride('_method'));
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

router.use(function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/signin');
    } else {
        if (req.session.user.role === 'cashier') {
            return res.redirect('/');
        } else {
            next();
        }
    }
});

//list organizations
router.get('/owner/:id', function(req, res, next) {

    var user = req.session.user;

    if (user) {

        var uid = req.params.id;
        var role = req.session.user.role;

        var session_message = req.session.message ? req.session.message : null;
        req.session.message = null;
        var session_error = req.session.error ? req.session.error : null;
        req.session.error = null;


        Organization.getAllByOwner(uid, function(err, rows) {
            if (err) {
                return res.render('organization/organizations', {
                    title: 'Organizations',
                    account: user,
                    message: session_message,
                    error: session_error,
                    errors: [{msg:"DB Error:"+err.code}]
                });
            } else {
                if (rows.length == 0) {
                    return res.render('organization/organizations', {
                        title: 'Organizations',
                        account: user,
                        message: session_message,
                        error: session_error,
                        errors: [{msg:"Organizations not found"}]
                    });
                } else {
                    return res.render('organization/organizations', {
                        title: 'Organizations',
                        account: user,
                        message: session_message,
                        error: session_error,
                        items: rows
                    });
                }
            }
        })

    } else {
        return res.redirect('/signin');
    }

});

router.get('/', function(req, res, next) {

    var user = req.session.user;

    if (user) {

        var id = req.session.user.id;
        var role = req.session.user.role;

        var session_message = req.session.message ? req.session.message : null;
        req.session.message = null;
        var session_error = req.session.error ? req.session.error : null;
        req.session.error = null;

        if (role === 'super') {

            Organization.getAll(function(err, rows) {
                if (err) {
                    return res.render('organization/organizations', {
                        title: 'Organizations',
                        account: user,
                        message: session_message,
                        error: session_error,
                        errors: [{msg:"DB Error:"+err.code}]
                    });
                } else {
                    if (rows.length == 0) {
                        return res.render('organization/organizations', {
                            title: 'Organizations',
                            account: user,
                            message: session_message,
                            error: session_error,
                            errors: [{msg:"Organizations not found"}]
                        });
                    } else {
                        return res.render('organization/organizations', {
                            title: 'Organizations',
                            account: user,
                            message: session_message,
                            error: session_error,
                            items: rows
                        });
                    }
                }
            })

        } else {
            Organization.getByOwner(id, function(err, rows) {
                if (err) {
                    return res.render('organization/organizations', {
                        title: 'Organizations',
                        account: user,
                        message: session_message,
                        error: session_error,
                        errors: [{msg:"DB Error:"+err.code}]
                    });
                } else {
                    if (rows.length == 0) {
                        return res.render('organization/organizations', {
                            title: 'Organizations',
                            account: user,
                            message: session_message,
                            error: session_error,
                            errors: [{msg:"Organizations not found"}]
                        });
                    } else {
                        return res.render('organization/organizations', {
                            title: 'Organizations',
                            account: user,
                            message: session_message,
                            error: session_error,
                            items: rows
                        });
                    }
                }
            })
        }

    } else {
        return res.redirect('/signin');
    }

});

/*
 * Create user
 */

//create user form
router.get('/create', function(req, res, next) {

    var sessionData = req.session;
    var user = sessionData.user;

    return res.render('organization/createorganization', {
        title: 'Create Organization',
        account: user
    });

});
//create user post
router.post('/create', function(req, res, next) {

    req.checkBody('name', 'Organizarion name required').notEmpty();

    var errors = req.validationErrors();

    var user = req.session.user;

    if (errors) {
        return res.render('organization/createorganization', {
            title: 'Create Organization',
            account: user,
            errors: errors
        });
    } else {

        Organization.create(req.body.name, req.body.owner, function(err, row){
            if (err) {
                return res.render('organization/createorganization', {
                    title: 'Create Organization',
                    account: user,
                    errors: [{msg:"Organization create error"}]
                });
            } else {
                if (row.affectedRows == 0) {
                    return res.render('organization/createorganization', {
                        title: 'Create Organization',
                        account: user,
                        errors: [{msg:"Organization named '" +req.body.name+"' already exists"}]
                    });
                } else {
                    req.session.message = 'Organization has been created!';
                    return res.redirect('/organizations');
                }
            }
        })
    }
});

/*
 * Edit
 */

router.get('/:id/edit', function(req, res, next) {

    var parent = req.session.user;

    var id = req.params.id;

    Organization.getById(id, function(err, rows){
        if (err) {
            return res.render('organization/organizations', {
                title: 'Organizations',
                account: parent,
                errors: [{msg:"DB Error:"+err.code}]
            });
        } else {
            if (rows.length == 0) {
                return res.render('organization/organizations', {
                    title: 'Organizations',
                    account: parent,
                    errors: [{msg:"Organization not found"}]
                });
            } else {
                return res.render('organization/editorganization', {
                    title: 'Organization Edit',
                    account: parent,
                    organization: rows[0]
                });
            }

        }
    });


});

router.put('/:id/edit', function(req, res, next) {

    var parent = req.session.user;

    req.checkBody('name', 'Organization name required').notEmpty();

    var errors = req.validationErrors();
    console.log(errors);

    var organization = req.body;
    var id = req.body.id;
    var uid = req.body.uid;

    if (errors) {
        return res.render('organization/editorganization', {
            title: 'Organization Edit',
            account: parent,
            organization: organization,
            errors: errors
        });
    } else {

        Organization.update(id, req.body.name, req.body.owner, function(err, result){

            if (err) {
                return res.render('organization/editorganization', {
                    title: 'Organization Edit',
                    account: parent,
                    organization: organization,
                    errors: [{msg:"Organization update error: "+err.sqlMessage}]
                });
            } else {
                if (result.rowsAffected == 0) {
                    return res.render('organization/editorganization', {
                        title: 'Organization Edit',
                        account: parent,
                        organization: organization,
                        errors: [{msg:"Nothing updated"}]
                    });
                } else {
                    Organization.getById(organization.id, function(err, row){
                        if (err) {
                            return res.render('organization/editorganization', {
                                title: 'Organization Edit',
                                account: parent,
                                organization: organization,
                                errors: [{msg:"Organization update error: "+err}]
                            });
                        } else {
                            req.session.message = 'Organization has been updated';
                            res.redirect('/organizations');
                        }
                    })

                }
            }
        })
    }
});

/*
 * delete
 */

router.delete('/delete/:id', function(req, res, next) {

    var delid = req.params.id;

    var sessionData = req.session;
    var user = sessionData.user;

    var id = req.session.user.id;

    Organization.delete(delid, function(err, rows) {
        if (err) {
            req.session.error = 'Delete error: '+err;
        } else {
            if (rows.affectedRows) {
                req.session.message = 'Organization has been deleted';
            } else {
                req.session.error = 'Organization not deleted';
            }
        }
        res.redirect('/organizations');
    });

});

/*
 * TARIFFS
 */

router.get('/:id/tariffs', function(req, res, next) {

    var user = req.session.user;
    var oid = req.params.id;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Error Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    if (user) {

        var id = req.session.user.id;
        var role = req.session.user.role;

        var session_message = req.session.message ? req.session.message : null;
        req.session.message = null;
        var session_error = req.session.error ? req.session.error : null;
        req.session.error = null;

        Tariff.getByOrganization(oid, function(err, rows) {
            if (err) {
                return res.render('tariff/tariffs', {
                    title: 'Tariffs',
                    account: user,
                    message: session_message,
                    oid: oid,
                    error: session_error,
                    errors: [{msg:"DB Error:"+err.code}]
                });
            } else {
                if (rows.length == 0) {
                    return res.render('tariff/tariffs', {
                        title: 'Tariffs',
                        account: user,
                        oid: oid,
                        message: session_message,
                        error: session_error,
                        errors: [{msg:"Tariffs not found"}]
                    });
                } else {
                    return res.render('tariff/tariffs', {
                        title: 'Tariffs',
                        account: user,
                        oid: oid,
                        message: session_message,
                        error: session_error,
                        items: rows
                    });
                }
            }
        })

    } else {
        return res.redirect('/signin');
    }

});

/*
 * Create tariff
 */

//create tariff form
router.get('/:oid/tariffs/create', function(req, res, next) {

    var sessionData = req.session;
    var user = sessionData.user;
    var oid = req.params.oid;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Error Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });
    return res.render('tariff/createtariff', {
        title: 'Create Tariff',
        oid: oid,
        types: config.tariffTypes,
        account: user
    });

});
//create user post
router.post('/:oid/tariffs/create', function(req, res, next) {

    req.checkBody('name', 'Tariff name required').notEmpty();
    req.checkBody('start', 'Start date required').notEmpty();
    req.checkBody('end', 'End date required').notEmpty();
    req.checkBody('type', 'Tariff type required').notEmpty();
    req.checkBody('discount', 'Discount required').notEmpty();

    var errors = req.validationErrors();

    var user = req.session.user;
    var oid = req.params.oid;

    console.log('oid='+oid+' '+req.params.oid)

    if (errors) {
        return res.render('tariff/createtariff', {
            title: 'Create Tariff',
            types: config.tariffTypes,
            account: user,
            errors: errors
        });
    } else {
        Tariff.create(req.body.name, req.body.start, req.body.end, req.body.type, req.body.discount, req.body.oid, req.body.owner, function(err, row){
            if (err) {
                return res.render('tariff/createtariff', {
                    title: 'Create Tariff',
                    account: user,
                    types: config.tariffTypes,
                    errors: [{msg:"Tariff create error "+err}]
                });
            } else {
                if (row.affectedRows == 0) {
                    return res.render('tariff/createtariff', {
                        title: 'Create Tariff',
                        account: user,
                        types: config.tariffTypes,
                        errors: [{msg:"Tariff named '" +req.body.name+"' already exists"}]
                    });
                } else {
                    req.session.message = 'Tariff has been created!';
                    return res.redirect('/organizations/'+oid+'/tariffs');
                }
            }
        })
    }
});

/*
 * delete
 */

router.delete('/:oid/tariffs/:id/delete', function(req, res, next) {

    var delid = req.params.id;

    var sessionData = req.session;
    var user = sessionData.user;

    var id = req.session.user.id;
    var oid = req.params.oid;

    Tariff.delete(delid, function(err, rows) {
        if (err) {
            req.session.error = 'Delete error: '+err;
        } else {
            if (rows.affectedRows) {
                req.session.message = 'Tariff has been deleted';
            } else {
                req.session.error = 'Tariff not deleted';
            }
        }
        return res.redirect('/organizations/'+oid+'/tariffs');
    });

});

/*
 * Edit
 */

router.get('/:oid/tariffs/:id/edit', function(req, res, next) {

    var parent = req.session.user;

    var id = req.params.id;
    var oid = req.params.oid;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Error Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(id, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        return res.render('tariff/edittariff', {
            title: 'Tariff Edit',
            account: parent,
            oid: oid,
            types: config.tariffTypes,
            tariff: rows[0]
        });

    });

});

router.put('/:oid/tariffs/:id/edit', function(req, res, next) {

    var parent = req.session.user;

    req.checkBody('name', 'Tariff name required').notEmpty();
    req.checkBody('start', 'Start date required').notEmpty();
    req.checkBody('end', 'End date required').notEmpty();
    req.checkBody('type', 'Tariff type required').notEmpty();
    req.checkBody('discount', 'Discount required').notEmpty();

    var errors = req.validationErrors();
    console.log(errors);

    var tariff = req.body;
    var id = req.body.id;
    var oid = req.params.oid;

    if (errors) {
        return res.render('tariff/edittariff', {
            title: 'Tariff Edit',
            account: parent,
            tariff: tariff,
            oid: oid,
            types: config.tariffTypes,
            errors: errors
        });
    } else {

        Tariff.update(id, req.body.name, req.body.start, req.body.end, req.body.type, req.body.discount, req.body.owner, function(err, result){

            if (err) {
                return res.render('tariff/edittariff', {
                    title: 'Tariff Edit',
                    account: parent,
                    tariff: tariff,
                    oid: oid,
                    types: config.tariffTypes,
                    errors: [{msg:"Tariff update error: "+err.sqlMessage}]
                });
            } else {
                if (result.rowsAffected == 0) {
                    return res.render('tariff/edittariff', {
                        title: 'Tariff Edit',
                        account: parent,
                        tariff: tariff,
                        oid: oid,
                        types: config.tariffTypes,
                        errors: [{msg:"Nothing updated"}]
                    });
                } else {
                    Tariff.getById(tariff.id, function(err, row){
                        if (err) {
                            return res.render('tariff/edittariff', {
                                title: 'Tariff Edit',
                                account: parent,
                                tariff: tariff,
                                oid: oid,
                                types: config.tariffTypes,
                                errors: [{msg:"Tariff update error: "+err}]
                            });
                        } else {
                            req.session.message = 'Tariff has been updated';
                            return res.redirect('/organizations/'+oid+'/tariffs');
                        }
                    })

                }
            }
        })
    }
});

/*
 * Transhes
 */

router.get('/:oid/tariffs/:tid/transhes', function(req, res, next) {

    var tid = req.params.tid;
    var oid = req.params.oid;

    var parent = req.session.user;

    var session_message = req.session.message ? req.session.message : null;
    req.session.message = null;
    var session_error = req.session.error ? req.session.error : null;
    req.session.error = null;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Incorrect Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            return res.render('transh/transhes', {
                title: 'Transhes',
                account: parent,
                tid: tid,
                oid: oid,
                errors: [{msg:"!DB Error:"+err.code}]
            });
        } else {
            if (rows.length == 0) {
                return res.render('transh/transhes', {
                    title: 'Transhes',
                    account: parent,
                    tid: tid,
                    oid: oid,
                    errors: [{msg:"Tariff not found"}]
                });
            } else {
                //
                var tariff = rows[0];

                Transh.allByTariff(tid, function(err, rows){
                    if (err) {
                        return res.render('transh/transhes', {
                            title: 'Transhes',
                            account: parent,
                            tid: tid,
                            oid: oid,
                            errors: [{msg:"DB Error:"+err.code}]
                        });
                    } else {
                        return res.render('transh/transhes', {
                            title: 'Transhes',
                            account: parent,
                            tid: tid,
                            oid: oid,
                            tariff: tariff,
                            message: session_message,
                            error: session_error,
                            items: rows
                        });
                    }

                })

            }

        }
    });
});

//delete
router.delete('/:oid/tariffs/:tid/transhes/:id/delete', function(req, res, next){
    var oid = req.params.oid;
    var tid = req.params.oid;
    var id = req.params.id;

    console.log('tid='+tid);

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Incorrect Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        var tariff = rows[0];
    });

    Transh.delete(id, function(err, rows){
        if (err) {
            req.session.error = 'Error deleting transh: '+err.message;
        } else {
            req.session.message = 'Transh has been deleted';
        }
        res.redirect('/organizations/'+oid+'/tariffs/'+tid+'/transhes');
    })


});

//edit
router.get('/:oid/tariffs/:tid/transhes/:trid/edit', function(req, res, next) {
    var tid = req.params.tid;
    var oid = req.params.oid;
    var trid = req.params.trid;
    var parent = req.session.user;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Incorrect Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }

        var tariff = rows[0];

        Transh.getById(trid, function(err, rows){
            if (err) {
                req.session.error = 'Error getting transh: '+err.message;
                return res.redirect('/organizations/'+oid+'/tariffs/'+tid+'/transhes');
            } else {
                if (!rows.length) {
                    req.session.error = 'Transh not found';
                    return res.redirect('/organizations/'+oid+'/tariffs/'+tid+'/transhes');
                } else {
                    return res.render('transh/edittransh', {
                        title: 'Edit Transh',
                        account: parent,
                        types: config.tariffTypes,
                        services: config.serviceType,
                        statuses: config.cardStatus,
                        tid: tid,
                        oid: oid,
                        transh: rows[0],
                        tariff: tariff
                    });
                }
            }
        })


    });
});

router.put('/:oid/tariffs/:tid/transhes/:trid/edit', function(req, res, next) {

    req.checkBody('service', 'Service type required').notEmpty();
    req.checkBody('status', 'Card status required').notEmpty();
    req.checkBody('lifetime', 'Life time required').notEmpty();
    req.checkBody('servicetime', 'Service time required').notEmpty();

    var errors = req.validationErrors();

    var tid = req.params.tid;
    var oid = req.params.oid;
    var parent = req.session.user;

    var transh = req.body;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Incorrect Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }

        var tariff = rows[0];
        if (errors) {

            return res.render('transh/edittransh', {
                title: 'Edit Transh',
                account: parent,
                tid: tid,
                oid: oid,
                tariff: tariff,
                types: config.tariffTypes,
                services: config.serviceType,
                statuses: config.cardStatus,
                transh: transh,
                errors: errors
            });
        } else {
            Transh.updateCardsForTransh(req.body, function(err, rows){
                if (err) {
                    return res.render('transh/edittransh', {
                        title: 'Create Transh',
                        account: parent,
                        tid: tid,
                        oid: oid,
                        tariff: tariff,
                        types: config.tariffTypes,
                        services: config.serviceType,
                        statuses: config.cardStatus,
                        transh: transh,
                        errors: err
                    });
                }

                console.log('++++')
                console.log(rows)
                console.log('++++')

                if (!rows.affectedRows) {
                    req.session.error = 'Incorrect Transh';
                }
                req.session.message = 'Transh has been updated';
                return res.redirect('/organizations/'+oid+'/tariffs/'+tid+'/transhes');
            })

        }

    });

});

//create
router.get('/:oid/tariffs/:tid/transhes/create', function(req, res, next) {
    var tid = req.params.tid;
    var oid = req.params.oid;
    var parent = req.session.user;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Incorrect Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }

        var tariff = rows[0];
        console.log(tariff);

        return res.render('transh/createtransh', {
            title: 'Create Transh',
            account: parent,
            types: config.tariffTypes,
            services: config.serviceType,
            statuses: config.cardStatus,
            tid: tid,
            oid: oid,
            tariff: tariff
        });

    });
});

router.post('/:oid/tariffs/:tid/transhes/create', function(req, res, next) {

    req.checkBody('count', 'Discount required').notEmpty();
    req.checkBody('type', 'Card type required').notEmpty();
    req.checkBody('service', 'Service type required').notEmpty();
    req.checkBody('status', 'Card status required').notEmpty();
    req.checkBody('lifetime', 'Life time required').notEmpty();
    req.checkBody('servicetime', 'Service time required').notEmpty();

    var errors = req.validationErrors();

    var tid = req.params.tid;
    var oid = req.params.oid;
    var parent = req.session.user;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Incorrect Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }

        var tariff = rows[0];
        if (errors) {

            return res.render('transh/createtransh', {
                title: 'Create Transh',
                account: parent,
                tid: tid,
                oid: oid,
                tariff: tariff,
                types: config.tariffTypes,
                services: config.serviceType,
                statuses: config.cardStatus,
                errors: errors
            });
        } else {
            var obj = {oid: oid, count: req.body.count, tariff: tid, type: req.body.type};
            Transh.generateCards(req.body, function(err, rows){
                if (err) {
                    return res.render('transh/createtransh', {
                        title: 'Create Transh',
                        account: parent,
                        tid: tid,
                        oid: oid,
                        tariff: tariff,
                        types: config.tariffTypes,
                        services: config.serviceType,
                        statuses: config.cardStatus,
                        errors: err
                    });
                }
                if (!rows.affectedRows) {
                    req.session.error = 'Incorrect Tariff: '+err.message;
                }
                req.session.message = 'Transh has been added';
                return res.redirect('/organizations/'+oid+'/tariffs/'+tid+'/transhes');
            })

        }

    });

});

//list cards for tariff
router.get('/:oid/tariffs/:tid/cards', function(req, res, next) {

    var parent = req.session.user;

    var oid = req.params.oid;
    var tid = req.params.tid;

    var session_message = req.session.message ? req.session.message : null;
    req.session.message = null;
    var session_error = req.session.error ? req.session.error : null;
    req.session.error = null;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Error Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }

        var tariff = rows[0];
        Card.getByTariffId(tid, function (err, rows)  {

            if (err) {
                return res.render('cards/cards', {
                    title: 'Cards',
                    account: parent,
                    oid: oid,
                    types: config.tariffTypes,
                    tariff: tariff,
                    //transh: null,
                    message: session_message,
                    error: session_error,
                    errors: err
                });

            } else {
                var errors = [];
                if (rows.length == 0) {
                    errors = [{msg:"No cards found"}]
                }
                return res.render('cards/cards', {
                    title: 'Cards',
                    account: parent,
                    oid: oid,
                    types: config.tariffTypes,
                    tariff: tariff,
                    transh: null,
                    message: session_message,
                    error: session_error,
                    errors: errors,
                    items: rows
                });
            }
        });
    });
});

//list cards for transh
router.get('/:oid/tariffs/:tid/transhes/:id/cards', function(req, res, next) {

    var parent = req.session.user;

    var id = req.params.id;
    var oid = req.params.oid;
    var tid = req.params.tid;

    var session_message = req.session.message ? req.session.message : null;
    req.session.message = null;
    var session_error = req.session.error ? req.session.error : null;
    req.session.error = null;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Error Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        }
    });

    Tariff.getById(tid, function(err, rows) {
        if (err) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Tariff: '+err.message;
            return res.redirect('/organizations/'+oid+'/tariffs');
        }

        var tariff = rows[0];
        Card.getByTranshId(id, function (err, rows)  {

            if (err) {
                return res.render('cards/cards', {
                    title: 'Cards',
                    account: parent,
                    oid: oid,
                    types: config.tariffTypes,
                    tariff: tariff,
                    transh: id,
                    message: session_message,
                    error: session_error,
                    errors: err
                });

            }
            return res.render('cards/cards', {
                title: 'Cards',
                account: parent,
                oid: oid,
                types: config.tariffTypes,
                tariff: tariff,
                transh: id,
                message: session_message,
                error: session_error,
                items: rows
            });
        });
    });
});

//save cards array to csv
router.get('/:oid/tariffs/:tid/transhes/:id/cards/tocsv', function(req, res, next) {

    var parent = req.session.user;

    var id = req.params.id;
    var oid = req.params.oid;
    var tid = req.params.tid;

    Organization.getById(oid, function(err, rows){
        if (err) {
            req.session.error = 'Error Organization: '+err.message;
            return res.redirect('/organizations');
        }
        if (!rows.length) {
            req.session.error = 'Incorrect Organization Id';
            return res.redirect('/organizations');
        } else {

            Tariff.getById(tid, function(err, rows) {
                if (err) {
                    req.session.error = 'Incorrect Tariff: '+err.message;
                    return res.redirect('/organizations/'+oid+'/tariffs');
                }
                if (!rows.length) {
                    req.session.error = 'Incorrect Tariff: '+err.message;
                    return res.redirect('/organizations/'+oid+'/tariffs');
                }

                var tariff = rows[0];
                Card.getByTranshId(id, function (err, rows)  {

                    if (err) {
                        console.log('++++ ERROR GETTING CARDS ++++++++')
                        console.log(err)
                        console.log('++++ ERROR GETTING CARDS ++++++++')
                        req.session.error = 'Error getting cards: '+err.message;
                        return res.redirect('/organizations/'+oid+'/tariffs/'+tid+'/transhes/'+id+'/cards');
                    } else {

                        var data = rows;

                        var options = {
                            delimiter   : ",",
                            wrap        : false
                        };
                        var csv = csvjson.toCSV(data, options);

                        console.log('++++ CSV ++++++++')
                        console.log(csv)
                        console.log('++++ CSV ++++++++')

                        res.setHeader('Content-disposition', 'attachment; filename=transh'+id+'.csv');
                        res.set('Content-Type', 'text/csv');
                        res.status(200).send(csv);

                    }
                });
            });
        }
    });
});

//from csv

router.post('/:oid/tariffs/:tid/transhes/:trid/cards/fromcsv', function(req, res, next){

    var trid = req.params.trid;
    var oid = req.params.oid;
    var tid = req.params.tid;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        var old_path = files.file.path;
        fs.readFile(old_path, "utf8", function(err, data) {

            console.log(data);
            console.log(err);

            if (err) {

            }

            var options = {
                delimiter   : ",",
                wrap        : false
            };
            var csvdata = csvjson.toArray(data, options);

            csvdata.shift();
            console.log('====== csvdata =========');
            console.log(csvdata);
            console.log('====== csvdata =========');

            Transh.updateCards(trid, csvdata, function (err, rows) {
                if (err) {
                    req.session.error = 'Error updating cards: '+err.message;
                } else {
                    req.session.message = 'Cards updated';
                }
                return res.redirect('/organizations/'+oid+'/tariffs/'+tid+'/transhes/'+trid+'/cards');
            })

        });
    });


});

//tester mark

router.put('/:oid/tariffs/:tid/cards/:cid/mark', function(req, res, next){

    var oid = req.params.oid;
    var tid = req.params.oid;
    var cid = req.params.cid;

    Card.toggleTest(cid, function (err, rows){
        console.log('--- ERROR --------');
        console.log(err);
        console.log(rows);
        console.log('--- ERROR -------');
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send('ok');
    })

});


module.exports = router;

