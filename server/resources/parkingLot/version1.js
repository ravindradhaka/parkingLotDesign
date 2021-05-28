var _ = require('lodash'),
	functions = require(__dirname + '/../../functions'),
	controllers = require(__dirname + '/../../controllers'),
	lib = require(__dirname + '/../../lib')
	customException = functions.exception,
	dbc = require('../../../config/dbConfig'),
	dataParking = require('../../../config/params'),
	request = require('request');

var parkingLot = controllers.parkingLot,
    params = dataParking.params,
    responseStatus = lib.responseStatus;



// console.log(dataParking);
module.exports = {
	createParking: function(req, res, next){
   		var con = dbc.createConn();
			var reqBody = req.body;
			var queryString = "INSERT INTO parking_lot (parking_address, parking_type, parking_capacity,parking_name,status) values ('" + reqBody.parkingAddress + "', '"+ reqBody.parkingType + "','"+reqBody.parkingCapacity+"','"+reqBody.parkingName+"','ACTIVE')";
			con.query(queryString ,function(err,rows){
					if(err) {
						console.log(err);
						throw err;
					}
					res.send(responseStatus.ParkingInsert);
					console.log("Parking Created");
			});
			dbc.closeConn(con);
	},
	createParkingSlots : function(req, res, next) {
			var con = dbc.createConn();
			var reqBody = req.body;
			var queryString = "INSERT INTO parking_slot (parking_slot_name, parking_occupied, parking_lot_id,status) values ('" + reqBody.parkingSlotName + "', 'false','"+reqBody.parkingLotId+"','ACTIVE')";
			con.query(queryString ,function(err,rows){
					if(err) {
						console.log(err);
						throw err;
					}
					res.send(responseStatus.ParkingSlotInsert);
					console.log("Parking Slot Inserted");
			});
			dbc.closeConn(con);
	},
	assignParkingSlots : function(req, res, next) {
			var con = dbc.createConn();
			var reqBody = req.body;
			if(!reqBody.vehicleNumber) {
				res.send(responseStatus.correctVehicleNo);
			}
			var queryString = "SELECT id as parkId FROM parking_slot WHERE parking_occupied='false' and status='ACTIVE' LIMIT 1";
			con.query(queryString ,function(err,rows){
					if(err) {
						console.log(err);
						throw err;
					}
					if(rows.length > 0) {
  						var parkId = rows[0].parkId;
 	  					var conUpdate = dbc.createConn();
		 					var queryStringUpdate = "UPDATE  parking_slot SET  parking_occupied = 'true', vehicle_number = '"+reqBody.vehicleNumber+"',start_time = CURRENT_TIMESTAMP WHERE id='"+parkId+"' and status = 'ACTIVE'";
		 					conUpdate.query(queryStringUpdate ,function(errUpdate,rowsUpdate){
		 							if(errUpdate) {
		 								 console.log(errUpdate);
		 								 throw errUpdate;
		 							}
									res.send(responseStatus.ParkingSlotAssign);
		 					});
		 					dbc.closeConn(conUpdate);
					} else {
						res.send(responseStatus.ParkingSlotFull);
					}
			});
			dbc.closeConn(con);
	},
	unParkVehicle : function(req, res, next) {
		  if(!req.body.vehicleNumber) {
				return res.send(responseStatus.ParkingVehicleNumberWrong)
			}
			var con = dbc.createConn();
			var reqBody = req.body;
			var queryString = "SELECT id as parkId,start_time as StartTime FROM parking_slot WHERE parking_occupied='true' and status='ACTIVE' and vehicle_number='"+reqBody.vehicleNumber+"'";
			con.query(queryString ,function(err,rows){
					if(err) {
						console.log(err);
						throw err;
					}
					if(rows.length > 0) {
							var parkId = rows[0].parkId;
							var parkingStartTime = new Date(rows[0].StartTime).getTime();
							var parkingEndingTime = new Date().getTime();
							var finalBillingPrice = ParkingPriceDetails(parkingStartTime);
							console.log("finalBillingPrice",finalBillingPrice)
							var conUpdate = dbc.createConn();
							var queryStringUpdate = "UPDATE  parking_slot SET  parking_occupied = 'false', vehicle_number = '',start_time = CURRENT_TIMESTAMP WHERE id='"+parkId+"' and status = 'ACTIVE'";
							conUpdate.query(queryStringUpdate ,function(errUpdate,rowsUpdate){
									if(errUpdate) {
										 console.log(errUpdate);
										 throw errUpdate;
									}
									responseStatus.unParkResponse.FinalBillingAmount = finalBillingPrice;
									res.send(responseStatus.unParkResponse);
							});
							dbc.closeConn(conUpdate);
					} else {
						res.send(responseStatus.NOTParkVehicle);
					}
			});
			dbc.closeConn(con);
	},
	changeParkingMode : function(req, res, next) {
			if(!req.body.parkingLotId) {
				return res.send(responseStatus.CorrectParkingID)
			}
			var con = dbc.createConn();
			var reqBody = req.body;
			var queryString = "SELECT status,parking_occupied as parkingOccupied  FROM parking_slot WHERE id='"+reqBody.parkingLotId+"'";
			con.query(queryString ,function(err,rows){
					if(err) {
						console.log(err);
						throw err;
					}
					console.log("rows",rows[0].status)
					console.log("reqBody.status",reqBody.status);
					if(rows.length > 0) {
						  if(rows[0].parkingOccupied == "false" && rows[0].status != reqBody.status) {
	                var conUpdate = dbc.createConn();
									var queryStringUpdate = "UPDATE  parking_slot SET  status = '"+reqBody.status+"' WHERE id='"+reqBody.parkingLotId+"'";
									conUpdate.query(queryStringUpdate ,function(errUpdate,rowsUpdate){
											if(errUpdate) {
												 console.log(errUpdate);
												 throw errUpdate;
											}
											res.send(responseStatus.parkingMode);
									});
									dbc.closeConn(conUpdate);
							} else {
								res.send(responseStatus.PreOcciped);
							}
					} else {
						res.send(responseStatus.CorrectParkingID);
					}
			});
			dbc.closeConn(con);
	},
	parkingStatus :function(req, res, next) {
			var con = dbc.createConn();
			var reqBody = req.query;
			var queryString = "select parking_slot.status as status,parking_slot.vehicle_number as Vehicle,parking_slot.parking_slot_name as slotName,parking_slot.id as slotId ,parking_slot.parking_occupied as occupied from parking_slot inner join  parking_lot on parking_lot.id = parking_slot.parking_lot_id and parking_lot.parking_manager_id = '"+reqBody.parkingManagerId+"'";
			con.query(queryString ,function(err,rows){
					if(err) {
						console.log(err);
						throw err;
					}
					if(rows.length > 0) {
						res.send(rows);
					} else {
						res.send(responseStatus.CorrectParkingID);
					}
			});
			dbc.closeConn(con);
	},
	createUser : function (req, res, next) {
			var con = dbc.createConn();
			var reqBody = req.body;
			if(!reqBody.name || !reqBody.userType || !reqBody.email || !reqBody.phone) {
				return res.send(responseStatus.IncorrectUser);
			}
			var queryString = "INSERT INTO user (name, user_type, email,phone,status) values ('" + reqBody.name + "', '"+ reqBody.userType + "','"+reqBody.email+"','"+reqBody.phone+"','ACTIVE')";
			con.query(queryString ,function(err,rows){
					if(err) {
						console.log(err);
						throw err;
					}
					res.send(responseStatus.correctUser);
					console.log("Parking Created");
			});
			dbc.closeConn(con);
	}
}

function ParkingPriceDetails (parkingStartTime) {
	var date1 = new Date(parkingStartTime);
	var date2 = new Date();
  var nofHour = 0;
	var diff = date2.getTime() - date1.getTime();

	var msec = diff;
	var hh = Math.floor(msec / 1000 / 60 / 60);
	msec -= hh * 1000 * 60 * 60;
	var mm = Math.floor(msec / 1000 / 60);
	msec -= mm * 1000 * 60;
	var ss = Math.floor(msec / 1000);
	msec -= ss * 1000;
	console.log(hh + ":" + mm + ":" + ss);
  nofHour = nofHour + hh;
	if(mm > 0) {
		nofHour = nofHour + 1;
	}
	console.log("params.PARKING_RATE",params)
	return (params.PARKING_RATE * nofHour);
}
