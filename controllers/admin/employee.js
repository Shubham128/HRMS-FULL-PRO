var config = require('../../config');
var commonFunction = require('../../common-function/helper');
var masterModel = require('../../models/admin/masterModel');
const fs 	= 	require('fs');
const moment = require('moment');
const crypto = require('crypto');

exports.employeeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = " SELECT * FROM admin WHERE is_deleted=0";
    config.query(query, function (error, servicedata) {
        if (error) {
            console.error(error.message);
            return;
        }
        else {
            var servicename = servicedata;    
            
        }

       
        paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {
           
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                servicename = servicedata;
                               
            }
        var error = req.flash('error');
        var success = req.flash('success');
        res.render('admin/EmployeeMaster/EmployeeList', { error, success,list : servicename});
        
    });
});
};

exports.ChangeEmployeeDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    var data = "UPDATE admin SET status = "+status+" WHERE admin.id ="+id;
   
    config.query(data, function (error, servicedata) {
        if (error) {
            console.error(error.message);
            return;
        }
        else {
            var servicename = servicedata;   
            if(servicename){
                res.send(JSON.stringify(1));
            }else{
                res.send(JSON.stringify(0));
            }
        }
        
    }); 
};

exports.DeleteEmployeeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE admin SET is_deleted = '1' WHERE admin.id="+id;
        
        config.query(data, function (error, servicedata) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                var servicename = servicedata;   
                if(servicename){
                    res.send(JSON.stringify(1));
                }else{
                    res.send(JSON.stringify(0));
                }
            }
            
        }); 
};

exports.AddEmployeeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

       
        var name = "'" + formData.name + "'";
        var vda_id = "'" + formData.vda_id + "'";
        var mobile = "'" + formData.mobile + "'";
        var email = "'" + formData.email + "'";
        var designation_id = "'" + formData.designation_id + "'";
        var department_id = "'" + formData.department_id + "'";
        var role_id = "'" + formData.role_id + "'";
        var hashedPassword = crypto.createHash('md5').update(formData.password).digest('hex');
        var passwordHash = "'" + hashedPassword + "'";
       
       
        var data ="INSERT INTO admin(name, vda_id, email,mobile,designation_id,department_id,role_id,password) VALUES (" + name + ',' + vda_id + ',' + email +  ',' + mobile + ',' + designation_id + ',' + department_id + ',' + role_id +',' + passwordHash +")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'employee Data Saved Succesfully');
                    res.redirect('/employeeList');
                }

            });  
         

    }
    else{
        var service = "SELECT id,department_id,designation_name FROM designation_master";;
      
config.query(service, function (error, servicedata) {
    if (error) {
        console.error(error.message);     
        return;
    } else {
        servicename = servicedata;
        // Fetch departments
        var departmentQuery = "SELECT D_id, D_name FROM department_master";
        config.query(departmentQuery, function (error, departmentData) {
            if (error) {
                console.error(error.message);
                return;
            } else {
                departmentList = departmentData;
                // Fetch job roles
                var jobRoleQuery = "SELECT id, role FROM roles";
                config.query(jobRoleQuery, function (error, jobRoleData) {
                    if (error) {
                        console.error(error.message);
                        return;
                    } else {
                        jobRoleList = jobRoleData;
                        const error = req.flash('error');
                        const success = req.flash('success');
                        res.render('admin/EmployeeMaster/AddEmployee', { error, success, servicelist: servicename, departmentList: departmentList, jobRoleList: jobRoleList });
                    }
                });
            }
        });
    }
});

        
            
        
           
    }
};