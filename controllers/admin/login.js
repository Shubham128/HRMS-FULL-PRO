var config = require('../../config');
const md5 = require('md5');
var loginModel = require('../../models/admin/loginModel');


exports.login = (req, res, next) => {
        const err = req.flash('error');
       res.render('admin/login/login', { error: err});

};

//check user is Authenticate
exports.loginaction = (req, res, next) => {

    var user_email_address = req.body.username;
    var user_password = req.body.password;
   // var counter = req.body.counter;
    var decode_password = md5(user_password);

    if (user_email_address && user_password) {
        query = `SELECT a.id,a.role_id,m.is_login_created, a.email,a.password,a.first_name,a.last_name,a.status,m.member_code,m.gender,role.role FROM admin as a LEFT JOIN members as m ON m.role_id = a.role_id LEFT JOIN roles as role ON role.id = a.id WHERE a.email = "${user_email_address}" and a.status =1`;


        config.query(query, function (error, data) {

            if (data.length > 0) {
                    if (data[0].is_login_created == 1) {
                      
                        for (var count = 0; count < data.length; count++) {
                            if (data[count].password == decode_password) {

                                //User_id
                                req.session.uid = data[count].id;
                                req.session.id = data[count].id;
                                // User Role
                                req.session.role_id = data[count].role_id;
                                //User Login ID
                                req.session.is_login = data[count].is_login_created;
                                //User role Name
                                req.session.role = data[count].role;
                                //User full name
                                req.session.fullname = data[count].first_name;
                               
                                res.redirect("/dashboard");
                            }
                            else {
                                req.flash('error', 'Incorrect Password');
                                res.redirect('/login');
                            }
                        }
                    }
                    else {
                        req.flash('error', 'Your Account hass been Disabled Please Contact to Adminstrator');
                        res.redirect('/login');
                    }
            

            }
            else {
                req.flash('error', 'Incorrect Username');
                res.redirect('/login');
            }
            res.end();
        });
    }
    else {
        req.flash('error', 'Please Enter Username and Password Details');
        res.redirect('/login');
        res.end();
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
    
};




