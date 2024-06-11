var config = require('../../config');
var commonFunction = require('../../common-function/helper');
var masterModel = require('../../models/Admin/MasterModel');
const fs 	= 	require('fs');
const moment = require('moment');




///companyMaster///


exports.CompanyData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = " SELECT * FROM company_master WHERE is_deleted=0";
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
        res.render('admin/master/CompanyMaster/CompanyList', { error, success, list: paginatedItems, currentPage, servicelist : servicename, totalPages: Math.ceil(totalPage / pageSize), pageSize });
        
    });
});
};

exports.ChangeCompanyDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    var data = "UPDATE company_master SET C_Status = "+status+" WHERE company_master.C_id ="+id;
   
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

exports.DeleteCompanyData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE company_master SET is_deleted = '1' WHERE company_master.C_id="+id;
        
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

exports.AddCompanyData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

       
     
        var C_Name = "'" + formData.C_Name + "'";
        var C_Status = "'" + formData.C_Status + "'";
        
       var C_Permission="'" + formData.C_Permission + "'";
       
        var data ="INSERT INTO company_master( C_Name, C_Status,C_Permission) VALUES (" + C_Name + ',' + C_Status + ',' + C_Permission + ")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'Company Data Saved Succesfully');
                    res.redirect('/CompanyList');
                }

            });  
         

    }
    else{
        var service = masterModel.blockNameList();
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);     
                return;
            }
            else {
                servicename = servicedata;
                const error = req.flash('error');
                const success = req.flash('success');
                res.render('admin/master/CompanyMaster/addCompany', { error, success, servicelist : servicename});
            }
            
        });
           
    }
};


exports.EditCompany = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.C_id; 

    if(req.body.length > 0){
        console.log(req.body);
    }
    else{

        var service = "SELECT C_id, C_Name, C_Status FROM company_master WHERE C_id="+id;

        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                var servicename = servicedata; 
                //console.log("zxcv");
                console.log(servicename);   
            }
            var error = req.flash('error');
            var success = req.flash('success');
            res.render('admin/master/CompanyMaster/updateCompany', { error, success, list: servicename});
            // config.query(service, function (error, clfdata) {
            //     if (error) {
            //         console.error(error.message);
            //         return;
            //     }
            //     else {
            //        var  clfdata = clfdata;
    
                    
            //     }
            
            
        });
    
}
    
};
     

exports.UpdateCompany = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    console.log("sdfsd");
    console.log(req.method);
    

    if(req.method == 'POST'){
        var formData = req.body;

        
        var C_Name = "'" + formData.C_Name + "'";
        
        var C_Status = "'" + formData.C_Status + "'";
        var result = formData.C_id;
        var rowid = result.trim();
        
      var data = "UPDATE company_master SET C_Name= "+ C_Name +"  ,C_Status= "+ C_Status +" WHERE C_id="+rowid;

        config.query(data, function (error, save) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                req.flash('success', 'Company Data Update Succesfully');
                res.redirect('/CompanyList');
            }

        });  

    }
    else{
        const error = req.flash('error');
        const success = req.flash('success');

        res.render('admin/master/CompanyMaster/updateCompany', { error, success });
    }
};



///DepartmentMaster///


exports.DepartmentData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = " SELECT * FROM department_master WHERE is_deleted=0";
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
        res.render('admin/master/DepartmentMaster/departmentList', { error, success, list: paginatedItems, currentPage, servicelist : servicename, totalPages: Math.ceil(totalPage / pageSize), pageSize });
        
    });
});
};

exports.ChangeDepartmentDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    console.log(id);
    var data = "UPDATE department_master SET D_Status = "+status+" WHERE department_master.D_id ="+id;
   
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

exports.DeleteDepartmentData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE department_master SET is_deleted = '1' WHERE department_master.D_id="+id;
        
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

exports.AddDepartmentData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

       
        var D_name = "'" + formData.D_name + "'";
        var C_id = "'" + formData.C_id + "'";
        var D_Status = "'" + formData.D_Status + "'";
        
       
       
        var data ="INSERT INTO department_master(D_name, C_id, D_Status) VALUES (" + D_name + ',' + C_id + ',' + D_Status + ")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'Company Data Saved Succesfully');
                    res.redirect('/DepartmentList');
                }

            });  
         

    }
    else{
        var service = "SELECT * FROM company_master ";
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);     
                return;
            }
            else {
                servicename = servicedata;
                const error = req.flash('error');
                const success = req.flash('success');
                res.render('admin/master/DepartmentMaster/addDepartment', { error, success, servicelist : servicename});
            }
            
        });
           
    }
};


// exports.EditDepartment = (req, res, next) => {
//     session = req.session;
//     //Checking Session 
//     if (!session.uid) {
//         res.redirect("/login");
//     }
//     var id =  req.query.D_id; 

//     if(req.body.length > 0){
//         console.log(req.body);
//     }
//     else{

//         var service = "SELECT D_id,D_name, C_id, D_Status FROM department_master WHERE D_id="+id;

      
      
//         config.query(service, function (error, servicedata) {
//             if (error) {
//                 console.error(error.message);
//                 return;
//             }
//             else {
//                 var servicename = servicedata; 
//                 //console.log("zxcv");
//                 console.log(servicename);   
//             }
//             var error = req.flash('error');
//             var success = req.flash('success');
//             res.render('admin/master/DeaprtmentMaster/updateDepartment', { error, success, list: servicename});
//             // config.query(service, function (error, clfdata) {
//             //     if (error) {
//             //         console.error(error.message);
//             //         return;
//             //     }
//             //     else {
//             //        var  clfdata = clfdata;
    
                    
//             //     }
            
            
//         });
    




// }
    
// };

exports.EditDepartment = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.D_id; 
console.log(id);
    if(req.body.length > 0){
        console.log(req.body);
    }
    else{

        var data = "SELECT * FROM company_master ";

        var service =  "SELECT * FROM department_master WHERE D_id="+id;
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                var servicename = servicedata; 
                //console.log("zxcv");
                console.log(servicename);   
            }

            config.query(data, function (error, clfdata) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                   var  clfdatas = clfdata;
                  console.log(clfdata);
                    
                }
            var error = req.flash('error');
            var success = req.flash('success');
            res.render('admin/master/DepartmentMaster/updateDepartment', { error, success, list: servicename, servicelist: clfdatas});
            
        });
    });
}
    
};
     

exports.UpdateDepartment = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    console.log("sdfsd");
    console.log(req.method);
    

    if(req.method == 'POST'){
        var formData = req.body;

        
        var D_name = "'" + formData.D_name + "'";
        var C_id = "'" + formData.C_id + "'";
        var D_Status = "'" + formData.D_Status + "'";
        var result = formData.D_id;
        var rowid = result.trim();
        
      var data = "UPDATE department_master SET D_name= "+ D_name +" ,C_id= "+ C_id +" ,D_Status= "+ D_Status +" WHERE D_id="+rowid;

        config.query(data, function (error, save) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                req.flash('success', 'Company Data Update Succesfully');
                res.redirect('/DeaprtmentList');
            }

        });  

    }
    else{
        const error = req.flash('error');
        const success = req.flash('success');

        res.render('admin/master/DepartmentMaster/updateDeaprtment', { error, success });
    }
};

/*designation master */

exports.designationData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = "SELECT dm.*,d.D_name FROM designation_master AS dm  LEFT JOIN department_master as d ON dm.department_id=d.D_id  WHERE dm.is_deleted = 0";
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
        res.render('admin/master/DesignationMaster/DesignationList', { error, success,list : servicename});
        
    });
});
};

exports.ChangeDesignationDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    var data = "UPDATE designation_master  SET status = "+status+" WHERE designation_master .id ="+id;
   
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

exports.DeleteDesignationData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE designation_master SET is_deleted = '1' WHERE designation_master.id="+id;
        
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

exports.AddDesignationData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

       
        var departmant_id = "'" + formData.departmant_id + "'";
        var designation_name = "'" + formData.designation_name + "'";
        var status = "'" + formData.status + "'";
       
       
       
        var data ="INSERT INTO designation_master( departmant_id,designation_name, status) VALUES (" +departmant_id +','+ designation_name +',' +  status +")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'employee Data Saved Succesfully');
                    res.redirect('/designationList');
                }

            });  
         

    }
    else{
        var service = "SELECT D_id, D_name FROM department_master where D_status=1 and is_deleted=0";;
      
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
                var jobRoleQuery = "SELECT D_id, D_name FROM department_master where D_status=1 AND is_deleted=0";
                config.query(jobRoleQuery, function (error, jobRoleData) {
                    if (error) {
                        console.error(error.message);
                        return;
                    } else {
                        jobRoleList = jobRoleData;
                        const error = req.flash('error');
                        const success = req.flash('success');
                        res.render('admin/master/DesignationMaster/addDesignation', { error, success, servicelist: servicename, departmentList: departmentList, jobRoleList: jobRoleList });
                    }
                });
            }
        });
    }
});

        
            
        
           
    }
};



////*  role master *\\\\\\\


exports.roleData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = "SELECT * FROM roles  WHERE is_deleted = 0 ";
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
        res.render('admin/master/RoleMaster/RoleList', { error, success,list : servicename});
        
    });
});
};

exports.ChangeRoleDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    var data = "UPDATE roles  SET status = "+status+" WHERE  roles.id ="+id;
   
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

exports.DeleteRoleData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE roles SET is_deleted = '1' WHERE roles.id="+id;
        
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
exports.AddRoleData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

       console.log(formData);
        var role = "'" + formData.role + "'";
        
        var status = "'" + formData.status + "'";
        
       
       
        var data ="INSERT INTO roles(role,status) VALUES (" + role + ',' + status + ")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'role Data Saved Succesfully');
                    res.redirect('/RoleList');
                }

            });  
         

    }
    else{
        var service = masterModel.blockNameList();
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);     
                return;
            }
            else {
                servicename = servicedata;
                const error = req.flash('error');
                const success = req.flash('success');
                res.render('admin/master/RoleMaster/addRole', { error, success, servicelist : servicename});
            }
            
        });
           
    }
};

exports.AddPermission = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

      console.log(formData.Role);
        var User = "'" + formData.User + "'";
        var Role= "'" + formData.Role+ "'";
       
        
       console.log(Role);
       console.log(User);
        var data ="UPDATE admin SET role_id = "+Role+" WHERE id ="+User;

            config.query(data, [Role, User], function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', ' Data Saved Succesfully');
                    res.redirect('/dashboard');
                }

            });  
         

    }
    else{
        var service = "SELECT * FROM roles  WHERE is_deleted = 0 AND status=1";
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);     
                return;
            }
            else {
                var service = "SELECT * FROM admin  WHERE is_deleted = 1 AND status=1";
                config.query(service, function (error, userdata) {
                    if (error) {
                        console.error(error.message);     
                        return;
                    }
                    else {
                username = userdata;
                const error = req.flash('error');
                const success = req.flash('success');
                res.render('admin/master/RoleMaster/Permission', { error, success, Userlist : username , servicelist : servicedata});
            }
            
        
            


        
        });
       
    }   
    });
} };
////*  area master *\\\\\\\


exports.areaData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = "SELECT * FROM area_master  WHERE is_deleted = 0 ";
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
        res.render('admin/master/AreaMaster/AreaList', { error, success,list : servicename});
        
    });
});
};

exports.ChangeAreaDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    var data = "UPDATE area_master  SET status = "+status+" WHERE  area_master.id ="+id;
   
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

exports.DeleteAreaData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE area_master  SET is_deleted = '1' WHERE area_master.id="+id;
        
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
exports.AddAreaData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

      
        var area = "'" + formData.area + "'";
        var subarea = "'" + formData.subarea + "'";
        var circle_id = "'" + formData.circle_id + "'";
        var status = "'" + formData.status + "'";
        
       
       
        var data ="INSERT INTO area_master(area,subarea,circle_id,status) VALUES (" +area + ',' + subarea + ',' + circle_id+ ',' + status +  ")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'AREA Data Saved Succesfully');
                    res.redirect('/areaList');
                }

            });  
         

    }
    else{
        var service = "SELECT * FROM area_master  WHERE is_deleted = 0";
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);     
                return;
            }
            else {
                servicename = servicedata;
                const error = req.flash('error');
                const success = req.flash('success');
                res.render('admin/master/AreaMaster/addArea', { error, success, servicelist : servicename});
            }
            
        });
           
    }
};


////*  complain type master *\\\\\\\


exports.CompalinTypeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = "SELECT a.*,b.D_name FROM complain_master as a LEFT JOIN department_master as b ON a.department_id=b.D_id  WHERE a.is_deleted = 0  AND B.is_deleted=0";
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
        res.render('admin/master/ComplainMaster/CompalainList', { error, success,list : servicename});
        
    });
});
};

exports.ChangeCompalinTypeDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    var data = "UPDATE complain_master  SET status = "+status+" WHERE  complain_master.id ="+id;
   
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

exports.DeleteCompalinTypeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE complain_master  SET is_deleted = '1' WHERE complain_master.id="+id;
        
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
exports.AddCompalinTypeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

      
        var department_id = "'" + formData.department_id + "'";
        var type= "'" + formData.type+ "'";
       var circle_id="'" + formData.circle_id+ "'";
        var status = "'" + formData.status + "'";
        
       
       
        var data ="INSERT INTO complain_master(department_id,type,status,circle_id) VALUES (" +department_id + ',' + type+ ',' + status  + ',' + circle_id +  ")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'Complain Data Saved Succesfully');
                    res.redirect('/ComplainTypeList');
                }

            });  
         

    }
    else{
        var service = "SELECT * FROM department_master  WHERE is_deleted = 0 AND D_status=1";
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);     
                return;
            }
            else {
                servicename = servicedata;
                const error = req.flash('error');
                const success = req.flash('success');
                res.render('admin/master/ComplainMaster/addComplainMaster', { error, success, servicelist : servicename});
            }
            
        });
           
    }
};


////*  feedback type master *\\\\\\\


exports.FeedbackTypeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    
    var query = "SELECT *FROM feedback_master  WHERE is_deleted = 0 ";
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
        res.render('admin/master/FeedbackMaster/FeedbackList', { error, success,list : servicename});
        
    });
});
};

exports.ChangeFeedbackTypeDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    var id =  req.query.rowid; 
    var status =  req.query.status; 

    console.log(status);
    var data = "UPDATE feedback_master  SET status = "+status+" WHERE  feedback_master.id ="+id;
   
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

exports.DeleteFeedbackTypeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE feedback_master  SET is_deleted = '1' WHERE feedback_master.id="+id;
        
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
exports.AddFeedbackTypeData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;

      
     
        var type= "'" + formData.type+ "'";
       
        var status = "'" + formData.status + "'";
        
       
       
        var data ="INSERT INTO feedback_master(type,status) VALUES (" + type+ ',' + status +  ")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'Feedback Data Saved Succesfully');
                    res.redirect('/feedbackTypeList');
                }

            });  
         

    }
    else{
        var service = "SELECT * FROM feedback_master  WHERE is_deleted = 0 AND status=1";
        config.query(service, function (error, servicedata) {
            if (error) {
                console.error(error.message);     
                return;
            }
            else {
                servicename = servicedata;
                const error = req.flash('error');
                const success = req.flash('success');
                res.render('admin/master/FeedbackMaster/addFeedbackMaster', { error, success, servicelist : servicename});
            }
            
        });
           
    }
};
