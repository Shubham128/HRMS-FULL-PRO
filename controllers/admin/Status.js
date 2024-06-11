var config = require('../../config');

exports.statusData = async (req, res, next) => {
    session = req.session;
   
    //Checking Session 
    if (!session.uid) {

        res.redirect("/login");
    }
   
     var id =session.uid;
    
    var service = "SELECT a.*,c.type FROM complain_box as a  LEFT JOIN complain_master as c ON c.id=a.type_id WHERE a.is_deleted=0 AND a.status=0 AND a.to_user_id ="+id;
    config.query(service, function (error, servicedata) {
        if (error) {
            console.error(error.message);     
            return;
        } else {
            servicename = servicedata;
           // console.log(servicename);
            // Fetch 
            var id =session.uid;
            var departmentQuery = `WITH RECURSIVE cte AS (
                -- Anchor member: start with the initial complaint
                SELECT 
                    c.id,
                    c.from_user_department,
                    c.from_user_id,
                    c.to_user_department,
                    c.to_user_id,
                    c.complain_id,
                    c.content,
                    c.name,
                    c.status,
                from_dept.D_name as from_dept_name,
                                   to_dept.D_name as to_dept_name,
                    0 AS depth,
                    CONCAT(a1.name, '->', a2.name) AS forward_chain
                FROM complain_box c
                JOIN admin a1 ON c.from_user_id = a1.id
                JOIN admin a2 ON c.to_user_id = a2.id
                JOIN department_master as from_dept ON c.from_user_department = from_dept.D_id
                            JOIN department_master as to_dept ON c.to_user_department = to_dept.D_id
                WHERE c.to_user_id = ${id} AND c.parent_id = 0 -- Adjust the initial conditions as needed
            
                UNION ALL
            
                -- Recursive member: find the next level of forwarded complaints
                SELECT 
                    c.id,
                    c.from_user_department,
                    c.from_user_id,
                    c.to_user_department,
                    c.to_user_id,
                    c.complain_id,
                    c.content,
                    c.name,
                    c.status,
                from_dept.D_name as from_dept_name,
                                   to_dept.D_name as to_dept_name,
                    cte.depth + 1,
                    CONCAT(cte.forward_chain, '->', a2.name) AS forward_chain
                FROM complain_box c
                JOIN admin a2 ON c.to_user_id = a2.id
                JOIN department_master as from_dept ON c.from_user_department = from_dept.D_id
                            JOIN department_master as to_dept ON c.to_user_department = to_dept.D_id
                JOIN cte ON c.parent_id = cte.id
                WHERE c.parent_id = cte.id
            )
            -- Final selection: get the details for all complaints in the forwarding chain
            SELECT 
               *
            FROM cte
             WHERE depth = (SELECT MAX(depth) FROM cte)
            ORDER BY depth;`;
            config.query(departmentQuery, function (error, departmentData) {
                if (error) {
                    console.error(error.message);
                    return;
                } else {
                    departmentList = departmentData;
                   console.log(departmentList);
                    // Fetch job roles
                    var id =session.uid;
                    
                    var jobRoleQuery = " SELECT a.*,c.type FROM complain_box as a  LEFT JOIN complain_master as c ON c.id=a.type_id WHERE a.is_deleted=0 AND a.status=1 AND a.to_user_id ="+id;
                    config.query(jobRoleQuery, function (error, jobRoleData) {
                        if (error) {
                            console.error(error.message);
                            return;
                        } else {
                            jobRoleList = jobRoleData;
                           
                            const error = req.flash('error');
                            const success = req.flash('success');
                            res.render('admin/status/status', { error, success, servicelist: servicename, departmentList: departmentList, jobRoleList: jobRoleList });
                        }
                    });
                }
            });
        }
    });
    
            
                
            

};
