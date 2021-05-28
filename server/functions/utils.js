var	dbc = require('../../config/dbConfig');
var lib = require(__dirname + '/../lib'),
    responseStatus = lib.responseStatus;

var utils = {
	isParkingManager : function (req, res, next) {
		var con = dbc.createConn();
		var reqBody = req.body;
		var managerId ;
		if(reqBody && reqBody.parkingManagerId) {
			managerId = reqBody.parkingManagerId;
		} else if(req.query.parkingManagerId) {
			managerId = req.query.parkingManagerId;
		} else {
			return res.send(responseStatus.parkingManagerId)
		}
		var queryString = "SELECT user_type as userType FROM user WHERE id = '"+managerId	+"'";
		con.query(queryString ,function(err,rows){
				if(err) {
					console.log(err);
					throw err;
				}
				if(rows.length > 0 && rows[0].userType == "ParkingManager") {
					 next();
				} else {
					return res.send(responseStatus.parkingManagerIdNOTPresent);
				}
		});
		dbc.closeConn(con);
	}
}

module.exports = utils;
