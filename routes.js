var path 		= require('path');
var express 	= require('express');
var router 		= express.Router();

var login 	            = require('./controllers/admin/login');
var admindashboard 	    = require('./controllers/admin/dashboard');
var master 	            = require('./controllers/admin/master');
var employee 	        = require('./controllers/admin/employee');

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



////// employee   route //////
router.get('/employeeList',employee.employeeData);
router.get('/changeEmployeeStatus',employee.ChangeEmployeeDataStatus);
router.get('/deleteEmployeeData',employee.DeleteEmployeeData);
router.post('/postEmployee',employee.AddEmployeeData);
router.get('/addEmployee',employee.AddEmployeeData);


////// designation   route //////
router.get('/designationList',master.designationData);
router.get('/changeDesignationStatus',master.ChangeDesignationDataStatus);
router.get('/deleteDesignationData',master.DeleteDesignationData);
router.post('/addDesignation',master.AddDesignationData);
router.get('/addDesignation',master.AddDesignationData);


////// role  route //////
router.get('/roleList',master.roleData);
router.get('/changeRoleStatus',master.ChangeRoleDataStatus);
router.get('/deleteRoleData',master.DeleteRoleData);
router.post('/addRole',master.AddRoleData);
router.get('/addRole',master.AddRoleData);


////// area master  route //////
router.get('/areaList',master.areaData);
router.get('/changeAreaStatus',master.ChangeAreaDataStatus);
router.get('/deleteAreaData',master.DeleteAreaData);
router.post('/addArea',master.AddAreaData);
router.get('/addArea',master.AddAreaData);


////// complain Type master  route //////
router.get('/ComplainTypeList',master.CompalinTypeData);
router.get('/changeComplainTypeStatus',master.ChangeCompalinTypeDataStatus);
router.get('/deleteComplainTypeData',master.DeleteCompalinTypeData);
router.post('/addComplainType',master.AddCompalinTypeData);
router.get('/addComplainType',master.AddCompalinTypeData);

////// feedback Type master  route //////
router.get('/feedbackTypeList',master.FeedbackTypeData);
router.get('/changeFeedbackTypeStatus',master.ChangeFeedbackTypeDataStatus);
router.get('/deleteFeedbackTypeData',master.DeleteFeedbackTypeData);
router.post('/addFeedbackType',master.AddFeedbackTypeData);
router.get('/addFeedbackType',master.AddFeedbackTypeData);

module.exports = router;