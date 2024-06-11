var config = require('../../config');
var commonFunction = require('../../common-function/helper');
const multer = require('multer');
const path = require('path');
const fileModel = require('../../models/Admin/FileModel');
const fs 	= 	require('fs');
const moment = require('moment');
const crypto = require('crypto');



exports.addComplain = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

    if(req.method == 'POST'){

        var formData = req.body;
 // Get the complain_id from formData
var combinedComplainId = formData.complain_id;

// Get the current date in YYYYMMDD format
var currentDate = new Date();
var year = currentDate.getFullYear();
var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
var day = ('0' + currentDate.getDate()).slice(-2);
var formattedDate = year + month + day;

// Generate a random number between 1000 and 9999 (you can adjust the range as needed)
var randomNumber = Math.floor(Math.random() * 9000) + 1000;

// Combine the complain_id with the current date and random number
var complain_i = "'" + combinedComplainId + formattedDate + randomNumber + "'";

// Output the result


       
        var name = "'" + formData.name + "'";
        var address = "'" + formData.address + "'";
        var mobile = "'" + formData.mobile + "'";
        var email = "'" + formData.email + "'";
       
        var subarea_id = "'" + formData.subarea_id + "'";
        var area_id = "'" + formData.area_id + "'";
        var content = "'" + formData.content + "'";
       var user_id=req.session.uid;
       var deptid=req.session.departmentId;
       var to_user_department="'" + formData.to_user_department + "'";
       var to_user_id="'" + formData.to_user_id + "'";
       //console.log(user_id)
       var complain_type = "'" + formData.complain_id + "'";;
       var complain_idi = complain_i;
        var data ="INSERT INTO complain_box(name, address, email,mobile,complain_id,area_id,circle_id,content,from_user_id,from_user_department,to_user_id,to_user_department,type_id) VALUES (" + name + ',' + address + ',' + email +  ',' + mobile + ',' + complain_idi + ',' + subarea_id + ',' + area_id +',' + content +','+user_id+','+deptid+','+to_user_id+','+to_user_department+','+complain_type+")";

            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    req.flash('success', 'employee Data Saved Succesfully');
                    res.redirect('/dashboard');
                }

            });  
         

    }
    else{
        var service = "SELECT * FROM complain_master where is_deleted=0 AND status=1";;
      
config.query(service, function (error, servicedata) {
    if (error) {
        console.error(error.message);     
        return;
    } else {
        servicename = servicedata;
        // Fetch departments
        var departmentQuery = "SELECT * FROM area_master  where is_deleted=0 AND status=1";
        config.query(departmentQuery, function (error, departmentData) {
            if (error) {
                console.error(error.message);
                return;
            } else {
                departmentList = departmentData;
                // Fetch job roles
                var jobRoleQuery = "SELECT * FROM area_master  where is_deleted=0 AND status=1 GROUP BY area";
                config.query(jobRoleQuery, function (error, jobRoleData) {
                    if (error) {
                        console.error(error.message);
                        return;
                    } else {
                        jobRoleList = jobRoleData;
                        const error = req.flash('error');
                        const success = req.flash('success');
                        res.render('admin/complain/complain', { error, success, servicelist: servicename, departmentList: departmentList, jobRoleList: jobRoleList });
                    }
                });
            }
        });
    }
});

        
            
        
           
    }
};

exports.getSubAreas = (req, res) => {
    var id =  req.query.rowid; 
//  console.log(id);
    if (!id) {
        return res.status(400).json({ error: 'Area ID is required' });
    }

    const query = "SELECT * FROM area_master WHERE circle_id ="+id;
    config.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching sub-areas:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(results);
    });
};


exports.ComplainInboxData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    const pageSize = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const error = req.flash('error');
    const success = req.flash('success');
    
    const u_id=session.uid;
    console.log(u_id);
    var query = "SELECT a.*,b.type FROM complain_box as a left join complain_master as b ON a.type_id =b.id  WHERE  a.status=0 and a.to_user_id ="+u_id;
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
        res.render('admin/complain/inboxList', { error, success,list : servicename});
        
    });
});
};

exports.resolveDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE complain_box SET status = '1' WHERE complain_box.id="+id;
        
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
exports.rejectDataStatus = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE complain_box SET status = '4' WHERE complain_box.id="+id;
        
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
exports.forwardData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid; 
        var data ="UPDATE complain_box SET status = '2' WHERE complain_box.id="+id;
        
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

exports.complianCountData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }

        var id =  req.query.rowid;
        console.log(id); 
        var data ="SELECT COUNT(from_user_id) AS count FROM complain_box WHERE status =0 AND to_user_id="+id;
        
        config.query(data, function (error, servicedata) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                const count = servicedata[0].count;
                console.log(count);
                res.json({ count });
            }
            
        }); 
        
};
exports.touserData = (req, res, next) => {
    const session = req.session;

    // Checking Session 
    if (!session.uid) {
        return res.redirect("/login");
    }

    const complainId = req.query.rowid; // Assuming you are using query parameters
    // console.log(complainId);
    const complainQuery = `SELECT circle_id FROM complain_master WHERE id = ?`;
    
    config.query(complainQuery, [complainId], (err, complainResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (complainResult.length > 0) {
            const complain_id = complainResult[0].circle_id;

            const adminQuery = `SELECT id, department_id FROM admin  WHERE is_incharge= 1 AND circle_id = ?`;
            config.query(adminQuery, [complain_id], (err, adminResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database query error' });
                }
                console.log(adminResult);
                res.json(adminResult);
            });
        } else {
            res.json({ message: 'No complain found' });
        }
    });
};
exports.touserDataa = (req, res, next) => {
    const session = req.session;

    // Checking Session 
    if (!session.uid) {
        return res.redirect("/login");
    }

    const complainId = req.query.rowid; // Assuming you are using query parameters
    // console.log(complainId);
    
    
   

            const adminQuery = `SELECT id, department_id FROM admin  WHERE  is_incharge= 1 AND circle_id = ?`;
            config.query(adminQuery, [complainId], (err, adminResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database query error' });
                }
                console.log(adminResult);
                res.json(adminResult);
            });
        } 
exports.complianForwadData = (req, res, next) => {
    session = req.session;
    
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
   

    if(req.method == 'POST'){

        var formData = req.body;
       
       
        var name = "'" + formData.name + "'";
        var address = "'" + formData.address + "'";
        var mobile = "'" + formData.mobile + "'";
        var email = "'" + formData.email + "'";
        var complain_id = "'" + formData.complain_id + "'";
        var subarea_id = "'" + formData.circle_id + "'";
        var area_id = "'" + formData.area_id + "'";
        var content = "'" + formData.content + "'";
        var from_user_department = "'" + formData.from_user_department + "'";
        var from_user_id = "'" + formData.from_user_id + "'";
        var to_user_department = "'" + formData.to_user_department + "'";
        var to_user_id = "'" + formData.to_user_id + "'";
        var parent_id = "'" + formData.parent_id + "'";
       
        var data ="INSERT INTO complain_box(name, address, email,mobile,complain_id,circle_id,area_id,content,from_user_id,from_user_department,to_user_department,to_user_id,parent_id) VALUES (" + name + ',' + address + ',' + email +  ',' + mobile + ',' + complain_id + ',' + subarea_id + ',' + area_id +',' + content +',' + from_user_id + ',' + from_user_department + ',' + to_user_department +',' + to_user_id +','+parent_id+")";

            config.query(data, function (error, save) {
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
        var service = "SELECT * FROM department_master where is_deleted=0 AND D_status=1";;
      
config.query(service, function (error, servicedata) {
    if (error) {
        console.error(error.message);     
        return;
    } else {
        servicename = servicedata;
        // Fetch departments
        var departmentQuery = "SELECT * FROM area_master  where is_deleted=0 AND status=1";
        config.query(departmentQuery, function (error, departmentData) {
            if (error) {
                console.error(error.message);
                return;
            } else {
                departmentList = departmentData;
                // Fetch job roles
                var id =  req.query.id;
                console.log(id);
                var jobRoleQuery = "SELECT * FROM complain_box  where id="+id;
                config.query(jobRoleQuery, function (error, jobRoleData) {
                    if (error) {
                        console.error(error.message);
                        return;
                    } else {
                        jobRoleList = jobRoleData;
                        const error = req.flash('error');
                        const success = req.flash('success');
                        res.render('admin/complain/forward', { error, success, servicelist: servicename, departmentList: departmentList, jobRoleList: jobRoleList });
                    }
                });
            }
        });
    }
});

        
            
        
           
    }
};

exports.getDesigantion = (req, res) => {
    var id =  req.query.rowid; 
//  console.log(id);
    if (!id) {
        return res.status(400).json({ error: 'department ID is required' });
    }

    const query = "SELECT * FROM designation_master WHERE department_id ="+id;
    config.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching sub-areas:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(results);
    });
};

exports.getUser = (req, res) => {
    var id =  req.query.rowid; 
//  console.log(id);
    if (!id) {
        return res.status(400).json({ error: 'designation ID is required' });
    }

    const query = "SELECT * FROM admin WHERE designation_id ="+id;
    config.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(results);
    });
};


exports.resolveData = (req, res) => {
  const session = req.session;
  if (!session.uid) {
    res.redirect('/login');
  }

  if (req.method === 'POST') {
    if (!req.files || Object.keys(req.files).length === 0) {
      req.flash('error', 'No files were uploaded.');
      return res.redirect('back');
    }

    const file = req.files.file;
    const allowedExtensions = /jpeg|jpg|png|pdf/;
    const extname = allowedExtensions.test(path.extname(file.name).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (!extname || !mimetype) {
      req.flash('error', 'Only .jpeg, .jpg, .png, and .pdf files are allowed!');
      return res.redirect('back');
    }

    if (file.size > 10 * 1024 * 1024) {
      req.flash('error', 'File size should not exceed 10MB!');
      return res.redirect('back');
    }

    const uploadPath = path.join(__dirname, '../../public/images/', file.name);

    file.mv(uploadPath, (err) => {
      if (err) {
        console.error(err);
        req.flash('error', 'File upload failed');
        return res.redirect('back');
      }

      const { name, address, complain_id } = req.body;
      const fileData = {
        name,
        address,
        complain_id,
        filename: file.name,
        filepath: `/images/${file.name}`
      };

      const query = 'INSERT INTO files (name, description, complain_id, filename, filepath) VALUES (?, ?, ?, ?, ?)';
      config.query(query, [fileData.name, fileData.address, fileData.complain_id, fileData.filename, fileData.filepath], (err) => {
        if (err) {
          console.error(err);
          req.flash('error', 'Database insert failed');
          return res.redirect('back');
        }
        req.flash('success', 'Data saved and file uploaded successfully!');
        res.redirect('/complaininbox');
      });
    });
  } else {
    var id=req.query.id;
    console.log(id);
    const fetchComplaintsQuery = "SELECT id FROM complain_box WHERE is_deleted=0 AND id="+id;
    const fetchAreasQuery = "SELECT * FROM area_master WHERE is_deleted=0 AND status=1 GROUP BY area";

    config.query(fetchComplaintsQuery, (error, complaintsData) => {
      if (error) {
        console.error(error.message);
        return;
      } else {
        var complainList =complaintsData;
        config.query(fetchAreasQuery, (error, areasData) => {
          if (error) {
            console.error(error.message);
            return;
          } else {
            const error = req.flash('error');
            const success = req.flash('success');
            res.render('admin/complain/resolve', { error, success, complaintsList: complainList, areasList: areasData });
          }
        });
      }
    });
  }
};







