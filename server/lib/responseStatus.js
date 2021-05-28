'use strict';

var responseStatus = {
  ParkingInsert : {
      "statusCode" : 200,
      "status" : true,
      "message" : "Parking Created"
  },
  ParkingSlotInsert : {
      "statusCode" : 200,
      "status" : true,
      "message" : "Parking Slot Created"
  },
  ParkingSlotAssign : {
      "statusCode" : 200,
      "status" : true,
      "message" : "Parking Assign to Vehicle"
  },
  ParkingSlotFull : {
      "statusCode" : 500,
      "status" : false,
      "message" : "Parking Slot is Not Available OR Parking Is Full"
  },
  ParkingVehicleNumberWrong : {
      "statusCode" : 500,
      "status" : false,
      "message" : "Please Enter Correct Parking Vehicle Number"
  },
  NOTParkVehicle : {
      "statusCode" : 500,
      "status" : false,
      "message" : "Vehicle Not Park"
  },
  unParkResponse : {
      "statusCode" : 200,
      "status" : true,
      "FinalBillingAmount" : ""
  },
  CorrectParkingID : {
    "statusCode" : 500,
    "status" : false,
    "message" : "Please Enter Correct Parking"
  },
  PreOcciped : {
    "statusCode" : 500,
    "status" : false,
    "message" : "Parking is PreOcciped you cannnot change the mode of parking || Parking In Same Mode"
  },
  parkingMode : {
      "statusCode" : 200,
      "status" : true,
      "message" : "Parking Mode Changed SuccessFully"
  },
  paringSlotNotAvailable : {
      "statusCode" : 200,
      "status" : true,
      "message" : "No Parking Slot Available"
  },
  correctVehicleNo : {
      "statusCode" : 500,
      "status" : false,
      "message" : "Please Enter Correct Vehicle Number"
  },
  parkingManagerId : {
      "statusCode" : 500,
      "status" : false,
      "message" : "Please Enter Valid Parking Manager Id"
  },
  parkingManagerIdNOTPresent : {
      "statusCode" : 500,
      "status" : false,
      "message" : "You Are Not Parking Manager .. Please Enter Correct Parking Manager Id"
  },
  IncorrectUser : {
      "statusCode" : 500,
      "status" : false,
      "message" : "Please Enter The Correct User Details"
  },
  correctUser : {
      "statusCode" : 200,
      "status" : true,
      "message" : "User Created",
      "parkingManagerid" : ""
  }
}

module.exports = responseStatus;
