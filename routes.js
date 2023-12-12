var path 		= require('path');
var express 	= require('express');
var router 		= express.Router();

var login 	            = require('./controllers/admin/login');
var admindashboard 	    = require('./controllers/admin/dashboard');
var master 	            = require('./controllers/admin/master');
var clfloan 	        = require('./controllers/admin/clfloanprovider');

//admin get method
router.get('/', login.login);
router.get('/login', login.login);
router.get('/logout',login.logout);
router.get('/dashboard',admindashboard.dashboard);

router.post('/loginaction',login.loginaction);


// Block Section 

router.get('/blocklist',master.Blocklist);
router.get('/DraftPanchang',master.DraftPanchang);

//CompanyMaster///
router.get('/CompanyList',master.CompanyData);
router.get('/changeCompanyStatus',master.ChangeCompanyDataStatus);
router.get('/deleteCompanyData',master.DeleteCompanyData);
router.get('/addCompany',master.AddCompanyData);
router.post('/addCompany',master.AddCompanyData);
router.get('/editCompany',master.EditCompany);
router.post('/updateCompany',master.UpdateCompany);


/////////Department Master///////
router.get('/DepartmentList',master.DepartmentData);
router.get('/changeDepartmentStatus',master.ChangeDepartmentDataStatus);
router.get('/deleteDepartmentData',master.DeleteDepartmentData);
router.get('/addDepartment',master.AddDepartmentData);
router.post('/addDepartment',master.AddDepartmentData);
router.get('/editDepartment',master.EditDepartment);
router.post('/updateDepartment',master.UpdateDepartment);

module.exports = router;