var config = require('../../config');
const fs = require('fs');

exports.dashboard = (req, res, next) => {
    session = req.session;
    if (session.uid) {
        user_id = session.uid;
        var role_id = session.role_id; // Assuming you have the role_id stored in the session
    } else {
        res.redirect("/login");
        return; // Added return to stop execution if not logged in
    }

    var inboxQuery = "";
    var resolveQuery = "";
    var forwardQuery = "";
	var barQuery = "";
    if (role_id === 1 || role_id === 2) {
		/*	SELECT 
    COUNT(DISTINCT CASE WHEN status = 0 THEN content END) AS inbox,
    COUNT(DISTINCT CASE WHEN status = 1 THEN content END) AS resolve,
    COUNT(DISTINCT CASE WHEN status = 2 AND content NOT IN (SELECT DISTINCT content FROM complain_box WHERE status = 0) THEN content END) AS forward,
    COUNT(DISTINCT CASE WHEN parent_id = 0 THEN content END) AS total_complaints
FROM complain_box;*/
        inboxQuery = `
		SELECT 
    COUNT(DISTINCT CASE WHEN status = 0 THEN content END) AS inbox,
    COUNT(DISTINCT CASE WHEN status = 1 THEN content END) AS resolve,
    COUNT(DISTINCT CASE WHEN status = 2  THEN content END) AS forward,
    COUNT(DISTINCT CASE WHEN status = 4  THEN content END) AS reject,
    COUNT(DISTINCT CASE WHEN parent_id = 0 THEN content END) AS total_complaints
FROM complain_box;
	`;
        resolveQuery = `SELECT COUNT(D_id) AS department_count
		FROM department_master`;
        forwardQuery = `SELECT COUNT(id) AS user_count
		FROM admin;`;
		barQuery = `SELECT 
		CONCAT(MONTHNAME(created_at), ' ', YEAR(created_at)) AS month,
		COUNT(parent_id ) AS complaint_count
	FROM 
		complain_box
		WHERE  parent_id=0
		GROUP BY MONTHNAME(created_at) 
	;`;
    } else {
        inboxQuery = `
		SELECT 
    COUNT(DISTINCT CASE WHEN status = 0 THEN content END) AS inbox,
    COUNT(DISTINCT CASE WHEN status = 1 THEN content END) AS resolve,
     COUNT(DISTINCT CASE WHEN status = 2  THEN content END) AS forward,
     COUNT(DISTINCT CASE WHEN status = 4  THEN content END) AS reject,
    COUNT(DISTINCT CASE WHEN parent_id = 0 THEN content END) AS total_complaints
FROM complain_box
		WHERE to_user_id = ${user_id};
	`;
        resolveQuery = `SELECT COUNT(DISTINCT content) AS resolve FROM complain_box WHERE status = 1 AND to_user_id = ${user_id};`;
        forwardQuery = `SELECT COUNT(DISTINCT content) AS forward FROM complain_box WHERE status = 2 AND to_user_id = ${user_id};`;
		barQuery = `SELECT 
		CONCAT(MONTHNAME(created_at), ' ', YEAR(created_at)) AS month,
		COUNT( *) AS complaint_count
	FROM 
		complain_box
		WHERE to_user_id = ${user_id} AND parent_id=0
		GROUP BY MONTHNAME(created_at) 
;`;
	}

    config.query(inboxQuery, function (error, inboxResult) {
        if (error) {
            console.error(error.message);
            return;
        }
        config.query(resolveQuery, function (error, resolveResult) {
            if (error) {
                console.error(error.message);
                return;
            }
            config.query(forwardQuery, function (error, forwardResult) {
                if (error) {
                    console.error(error.message);
                    return;
                }
				config.query(barQuery, function (error, barResult) {
					if (error) {
						console.error(error.message);
						return;
					}
				statusPieData = [
                    { label: 'Inbox', value: inboxResult[0].inbox },
                    { label: 'Resolve', value: inboxResult[0].resolve },
                    { label: 'Forward', value: inboxResult[0].forward }
                ];
				const monthlyBarData = [];

				// Iterate over the barResult array to construct objects for each month
				barResult.forEach(row => {
					monthlyBarData.push({
						month: row.month,
						complain: row.complaint_count
					});
				});
		
                res.render('admin/dashboard/dashboard_view', { inbox: inboxResult[0], resolve: resolveResult[0], forward: forwardResult[0],statusPieData,
                    monthlyBarData, active: "dashboard" });
            });
		});
        });
    });
};




