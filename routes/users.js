var express = require('express');
var User = require('./../models/user');
var bcrypt = require('bcrypt');

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
    var sessionData = req.session;
    console.log(req.session);
    if (!req.session.user) {
        return res.redirect('/signin');
    } else {
        next();
    }
});

//list users
router.get('/', function(req, res, next) {

    var sessionData = req.session;
    var user = sessionData.user;
    var role = sessionData.user.role;

    var roles = role === 'super' ? 'admin' : 'cashier';

    var id = req.session.user.id;

    var session_message = req.session.message ? req.session.message : null;
    req.session.message = null;
    var session_error = req.session.error ? req.session.error : null;
    req.session.error = null;

    User.getForRoles(roles, id, function(err, rows) {
        if (err) {
            return res.render('user/users', {
                title: 'Users',
                account: user,
                message: session_message,
                error: session_error,
                errors: [{msg:"DB Error:"+err.code}]
            });
        } else {
            if (rows.length == 0) {
                return res.render('user/users', {
                    title: 'Users',
                    account: user,
                    message: session_message,
                    error: session_error,
                    errors: [{msg:"Users not found"}]
                });
            } else {
                return res.render('user/users', {
                    title: 'Users',
                    account: user,
                    message: session_message,
                    error: session_error,
                    items: rows
                });
            }
        }

    });

});

/*
 * Create user
 */

//create user form
router.get('/create', function(req, res, next) {

    var sessionData = req.session;
    var user = sessionData.user;
    var role = sessionData.user.role;

    var returnRole = null;
    if (role === 'super') {
        returnRole = {
            userRole: 'admin',
            userRoleName: 'Administrator'
        }
    } else if (role === 'admin') {
        returnRole = {
            userRole: 'cashier',
            userRoleName: 'Cashier'
        }
    }
    return res.render('user/createuser', {
        title: 'Create User',
        account: user,
        role: returnRole
    });

});
//create user
router.post('/create', function(req, res, next) {

    req.checkBody('name', 'First name required').notEmpty();
    req.checkBody('last', 'Last name required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    console.log(errors);

    var user = req.session.user;
    var role = user.role;

    var returnRole = null;
    if (role === 'super') {
        returnRole = {
            userRole: 'admin',
            userRoleName: 'Administrator'
        }
    } else if (role === 'admin') {
        returnRole = {
            userRole: 'cashier',
            userRoleName: 'Cashier'
        }
    }

    if (errors) {
        return res.render('user/createuser', {
            title: 'Create User',
            account: user,
            role: returnRole,
            errors: errors
        });
    } else {

        bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
            //save to db
            User.create(req.body.name, req.body.last, req.body.email, bcryptedPassword, req.body.role, req.body.parent, function(err, row){
                if (err) {
                    return res.render('user/createuser', {
                        title: 'Create User',
                        account: user,
                        role: returnRole,
                        errors: [{msg:"User update error"}]
                    });
                } else {
                    if (row.affectedRows == 0) {
                        return res.render('user/createuser', {
                            title: 'Create User',
                            account: user,
                            role: returnRole,
                            errors: [{msg:"User with email '" +req.body.email+"' already exists"}]
                        });
                    } else {
                        req.session.message = 'User has been created!';
                        return res.redirect('/users');
                    }
                }
            })

        });
    }


});

/*
 * Profile
 */

router.get('/profile', function(req, res, next) {
    var user = req.session.user;

    return res.render('user/editprofile', {
        title: 'Profile',
        subtitle: 'Profile',
        account: user,
        user: user
    });

});

router.post('/profile', function(req, res, next) {

    var user = req.session.user;

    req.checkBody('name', 'First name required').notEmpty();
    req.checkBody('last', 'Last name required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    console.log(errors);

    var sessionData = req.session;

    if (errors) {
        return res.render('user/editprofile', {
            title: 'Profile',
            account: user,
            user: user,
            subtitle: 'Profile',
            errors: errors
        });
    } else {
        console.log('BODY');
        console.log(req.body);

        bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
            //save to db
            User.updateProfile(user.id, req.body.name, req.body.last, req.body.email, bcryptedPassword, function(err, result){

                if (err) {
                    return res.render('user/editprofile', {
                        title: 'Profile',
                        account: user,
                        user: user,
                        subtitle: 'Profile',
                        errors: [{msg:"User update error"}]
                    });
                } else {
                    if (result == 0) {
                        return res.render('user/editprofile', {
                            title: 'Profile',
                            account: user,
                            user: user,
                            subtitle: 'Profile',
                            errors: [{msg:"Nothing updated"}]
                        });
                    } else {
                        console.log('id='+user.id);
                        User.getById(user.id, function(err, row){
                            if (err) {
                                return res.render('user/editprofile', {
                                    title: 'Profile',
                                    account: user,
                                    user: user,
                                    subtitle: 'Profile',
                                    errors: [{msg:"User update error"}]
                                });
                            } else {
                                req.session.user = row[0];

                                return res.render('user/editprofile', {
                                    title: 'Profile',
                                    account: req.session.user,
                                    user: req.session.user,
                                    subtitle: 'Profile',
                                    success: {msg:"User successfully updated"}
                                });
                            }
                        })

                    }
                }
            })

        });
    }


});

/*
 * Edit
 */

router.get('/edit/:id', function(req, res, next) {

    var parent = req.session.user;

    var id = req.params.id;

    User.getById(id, function(err, rows){
       if (err) {
           return res.render('user/users', {
               title: 'Users',
               account: parent,
               errors: [{msg:"DB Error:"+err.code}]
           });
       } else {
           if (rows.length == 0) {
               return res.render('user/users', {
                   title: 'Users',
                   account: parent,
                   errors: [{msg:"Users not found"}]
               });
           } else {
               return res.render('user/edituser', {
                   title: 'User Edit',
                   account: parent,
                   subtitle: rows[0].name+' '+rows[0].last,
                   user: rows[0]
               });
           }

       }
    });


});

router.put('/edit/:id', function(req, res, next) {

    var parent = req.session.user;

    req.checkBody('name', 'First name required').notEmpty();
    req.checkBody('last', 'Last name required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password required').notEmpty();
    req.checkBody('confirmPassword', '!Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    console.log(errors);

    var user = req.body;
    var id = req.body.id;
    if (errors) {
        return res.render('user/edituser', {
            title: 'User Edit',
            account: parent,
            user: user,
            errors: errors
        });
    } else {

        bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
            //save to db
            User.update(id, req.body.name, req.body.last, req.body.email, bcryptedPassword, function(err, result){

                if (err) {
                    return res.render('user/edituser', {
                        title: 'User Edit',
                        account: parent,
                        user: user,
                        subtitle: user.name+' '+user.last,
                        errors: [{msg:"User update error: "+err.sqlMessage}]
                    });
                } else {
                    if (result == 0) {
                        return res.render('user/edituser', {
                            title: 'User Edit',
                            account: parent,
                            user: user,
                            subtitle: user.name+' '+user.last,
                            errors: [{msg:"Nothing updated"}]
                        });
                    } else {
                        console.log('id='+user.id);
                        User.getById(user.id, function(err, row){
                            if (err) {
                                return res.render('user/edituser', {
                                    title: 'User Edit',
                                    account: parent,
                                    user: user,
                                    subtitle: user.name+' '+user.last,
                                    errors: [{msg:"!!!User update error: "+err}]
                                });
                            } else {
                                req.session.message = 'User has been updated';
                                res.redirect('/users');
                            }
                        })

                    }
                }
            })
        });

    }
});

/*
 * delete
 */

router.delete('/delete/:id', function(req, res, next) {

    var delid = req.params.id;

    var sessionData = req.session;
    var user = sessionData.user;
    var role = sessionData.user.role;

    var roles = role === 'super' ? 'admin' : 'cashier';
    var id = req.session.user.id;

    User.delete(delid, function(err, rows) {
        if (err) {
            req.session.error = 'Delete error: '+err;
        } else {
            if (rows.affectedRows) {
                req.session.message = 'User has been deleted';
            } else {
                req.session.error = 'User not deleted';
            }
        }
        return res.render('user/users', {
            title: 'Users',
            account: user,
            message: req.session.message,
            error: req.session.error,
            items: []
        });
    });

});

module.exports = router;
