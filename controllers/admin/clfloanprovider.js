var config = require('../../config');
var commonFunction = require('../../common-function/helper');
var masterModel = require('../../models/admin/masterModel');
const fs 	= 	require('fs');



/**********************    CLF LOAN  PROVIDER START HERE **********************/ 

exports.clfLoanList = (req, res, next) => {
  session = req.session;
  //Checking Session 
  if (!session.uid) {
      res.redirect("/login");
  }
  const pageSize = 6;
  const currentPage = parseInt(req.query.page) || 1;
  const error = req.flash('error');
  const success = req.flash('success');
  var service = masterModel.blockNameList();
  
  var query = " SELECT cl.*,c.name as clfname,v.name as voname,lt.loan_name as loanname FROM clf_loan_provider as cl LEFT JOIN clf_data as c ON c.id=cl.clf_id LEFT JOIN vo_data as v ON v.id=cl.vo_id LEFT JOIN loan_type_master as lt ON lt.id=cl.loan_type_id WHERE 1 ORDER BY id DESC";
  config.query(service, function (error, servicedata) {
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
      res.render('admin/clfloan/list_of_clf_loan', { error, success, list: paginatedItems, currentPage, servicelist : servicename, totalPages: Math.ceil(totalPage / pageSize), pageSize });
      
  });
});
};

exports.clfLoanDistribution = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    
    var clfqry = "select * from clf_data where status=1 AND is_deleted=0";
    var voqry = "select * from vo_data where status=1 AND is_deleted=0";
    var voDataArr = '';
    var clfDataArr = '';
    config.query(voqry, function (error, voDataResult) {
        if (error) {
            console.error(error.message);
            return;
        }
        else
        {
            console.log(voDataResult);
            voDataArr = voDataResult;  
        }
        config.query(clfqry, function (error, clfDataResult) {
            if (error) {
                console.error(error.message);
                return;
            }
            else
            {
                clfDataArr = clfDataResult;
            }
           
        var error = req.flash('error');
        var success = req.flash('success');
        res.render('admin/clfloan/clf_loan_distribution', { error, success, vodata : voDataArr, clfdata : clfDataArr });
      });
    });

};


exports.AddLoanData = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    
    if(req.method == 'POST')
    {
        var formData = req.body;
        console.log(formData);
        var vo_id                    = formData.vo_id;
        var clf_id                   = formData.clf_id;
        var created_by               = session.uid;
        var loan_type_id             = formData.loan_type_id;
        var loan_provide_date        = formData.loan_provide_date;
        var loan_amount              = formData.loan_amount;
        var emi_amount               = formData.emi_amount;
        

        var sanquery = "INSERT INTO clf_loan_provider ( clf_id,vo_id,loan_type_id,loan_provide_date,loan_amount,emi_amount,created_by ) VALUES ?";
        var sanArr = [
            [clf_id,vo_id,loan_type_id,loan_provide_date,loan_amount,emi_amount,created_by]
          ];
        
          config.query(sanquery,[sanArr],function(error,result){
            console.log(result);
            if (error) 
            {
                req.flash('error', 'Some thing went wrong,please try again latter.');
                res.redirect("/clfloanlist");
            }
            else 
            {
               req.flash('success', 'The loan providing process has been completed successfully.');
               res.redirect("/clfloanlist");
            } 
          });  

    }
    
};


exports.editClfLoan = (req, res, next) => {
    session = req.session;
    //Checking Session 
    if (!session.uid) {
        res.redirect("/login");
    }
    
    var voqry = "select * from vo_data where status=1 AND is_deleted=0";
    var voDataResult  = [];
    config.query(voqry, function (error, voDataResult) {
        if (error) {
            console.error(error.message);
            return;
        }
      });

      const id = req.params.id;
      var sqlqry = "select * from clf_loan_provider where id="+id;
      config.query(sqlqry, function (error, clfloandata) {
        if (error) {
            console.error(error.message);
            return;
        }
        var error = req.flash('error');
        var success = req.flash('success');
        res.render('admin/clfloan/edit_clf_loan_distribution', { error, success, clfloanrowdata : clfloandata, vodata : voDataResult });
      });
};
/**********************    CLF LOAN  PROVIDER END HERE **********************/ 




