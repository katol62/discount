var express = require('express');
var Organization = require('./../models/organization');

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
        if (req.session.user.role !== 'admin') {
            return res.redirect('/');
        } else {
            next();
        }
    }
});

//list organizations
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

router.get('/edit/:id', function(req, res, next) {

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

router.put('/edit/:id', function(req, res, next) {

    var parent = req.session.user;

    req.checkBody('name', 'Organization name required').notEmpty();

    var errors = req.validationErrors();
    console.log(errors);

    var organization = req.body;
    var id = req.body.id;

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
        return res.render('organization/organizations', {
            title: 'Organizations',
            account: user,
            message: req.session.message,
            error: req.session.error,
            items: []
        });
    });

});


module.exports = router;

