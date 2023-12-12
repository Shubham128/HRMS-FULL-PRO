var config = require('../../config');
exports.blockNameList = function (req, res, next) {
    var service = "SELECT * FROM `block_list` WHERE status='1'";
    return service
};




