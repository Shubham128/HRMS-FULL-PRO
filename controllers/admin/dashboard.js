var config = require('../../config');
const fs = require('fs');

exports.dashboard = (req, res, next) => {
	session = req.session;
	// if (session.uid) {
	// 	user_id = session.uid;
	// } else {
	// 	res.redirect("/login");
	// }
	//var from_date = formatDateymd(new Date());
	//var to_date = formatDateymd(new Date());
	
	//console.log("ddasd");
	//console.log(from_date);
	//console.log(to_date);

	// var poojaname = "SELECT * FROM bs_pooja_master where is_deleted=0";
	// config.query(poojaname, function (error, pooja) {
	// 	if (error) {
	// 		console.error(error.message);
	// 		return;
	// 	}
	// 	else {
	// 		poojaname = pooja;

	// 		console.log("dsad");
	// 		console.log(poojaname);
	// 	}
		//res.render('admin/dashboard/dashboard_view', { pooja: poojaname, fdate: from_date, tdate: to_date, active: "dashboard"});
		res.render('admin/dashboard/dashboard_view', { active: "dashboard"});
	//});
};



