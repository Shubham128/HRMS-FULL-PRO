var config = require('../../config');
var commonFunction = require('../../common-function/helper');
var masterModel = require('../../models/admin/masterModel');
const fs 	= 	require('fs');
const moment = require('moment');

// List OF Block Data

exports.Blocklist = (req, res, next) => {
    session = req.session;

    console.log("session");
    console.log(session);
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
        const pageSize = 20;
        const currentPage = parseInt(req.query.page) || 1;
        const error = req.flash('error');
        const success = req.flash('success');

        var query = "SELECT * FROM block_list WHERE status='1' AND is_deleted='0' ORDER BY id DESC";
        
        var clf = "SELECT COUNT(c.block_id)as clf, b.block_name FROM clf_data as c LEFT JOIN block_list as b ON c.block_id = b.id GROUP BY c.block_id";
        config.query(clf, function (error, clfdata) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                var clflist = clfdata;   
                
            }
            paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {
            
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    paginatedItems = paginatedItems;
                 
                                
                }
            var error = req.flash('error');
            var success = req.flash('success');
            res.render('admin/master/list_of_blocks', { error, success, list: paginatedItems,clflist: clflist, currentPage,  totalPages: Math.ceil(totalPage / pageSize), pageSize, active: 'pooja_package_media_list' });            
       });
    }); 
};
exports.DraftPanchang = (req, res, next) => {
    session = req.session;

    console.log("session");
    console.log(session);
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
        const pageSize = 20;
        const currentPage = parseInt(req.query.page) || 1;
        const error = req.flash('error');
        const success = req.flash('success');

        var query = "SELECT * FROM block_list WHERE status='1' AND is_deleted='0' ORDER BY id DESC";
        
        var clf = "SELECT COUNT(c.block_id)as clf, b.block_name FROM clf_data as c LEFT JOIN block_list as b ON c.block_id = b.id GROUP BY c.block_id";
        config.query(clf, function (error, clfdata) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                var clflist = clfdata;   
                
            }
            paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {
            
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    paginatedItems = paginatedItems;
                 
                                
                }
            var error = req.flash('error');
            var success = req.flash('success');
            res.render('admin/master/list_of_Draft', { error, success, list: paginatedItems,clflist: clflist, currentPage,  totalPages: Math.ceil(totalPage / pageSize), pageSize, active: 'pooja_package_media_list' });            
       });
    }); 
};


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
    var data = "UPDATE company_master SET D_Status = "+status+" WHERE company_master.D_id ="+id;
   
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
        var data ="UPDATE company_master SET is_deleted = '1' WHERE company_master.D_id="+id;
        
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

       
        var D_name = "'" + formData.D_name + "'";
        var C_Name = "'" + formData.C_Name + "'";
        var D_Status = "'" + formData.D_Status + "'";
        
       
       
        var data ="INSERT INTO company_master(D_name, C_Name, D_Status) VALUES (" + D_name + ',' + C_Name + ',' + D_Status + ")";

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
    var id =  req.query.D_id; 

    if(req.body.length > 0){
        console.log(req.body);
    }
    else{

        var service = "SELECT D_id,D_name, C_Name, D_Status FROM company_master WHERE D_id="+id;

      
      
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
        var C_Permission = "'" + formData.C_Permission + "'";
        var C_Status = "'" + formData.C_Status + "'";
        var result = formData.C_id;
        var rowid = result.trim();
        
      var data = "UPDATE company_master SET C_Name= "+ C_Name +" ,C_Permission= "+ C_Permission +" ,C_Status= "+ C_Status +" WHERE C_id="+rowid;

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