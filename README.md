# parkingLotDesign
Parking Lot

[1]  database setting  config/dbConfig.js

    var db_config_new = {
        host: "127.0.0.1",//Local IP changed
        user: "root",
        password: "root",
        database: "parking_lot",
        port : 3306
    };

    => Please local Machine have mysql install & create database name parking_lot

    =>  use parking_lot; // select database;

    => creates tables ... Please run below query to create table

    (1) parking_lot

    CREATE TABLE `parking_lot` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `parking_address` varchar(255) NOT NULL,
      `parking_type` varchar(255) DEFAULT NULL,
      `parking_capacity` varchar(10) DEFAULT NULL,
      `parking_name` varchar(50) DEFAULT NULL,
      `status` varchar(50) DEFAULT NULL,
      `parking_manager_id` int(10) DEFAULT NULL,
      PRIMARY KEY (`id`)
    )     


    (2) parking_slot

    CREATE TABLE `parking_slot` (
       `id` int(11) NOT NULL AUTO_INCREMENT,
       `parking_slot_name` varchar(255) NOT NULL,
       `parking_occupied` varchar(10) DEFAULT NULL,
       `parking_lot_id` int(10) DEFAULT NULL,
       `status` varchar(20) DEFAULT NULL,
       `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
       `end_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
       `vehicle_number` varchar(20) DEFAULT NULL,
       PRIMARY KEY (`id`)
     )

     (3) user

      CREATE TABLE `user` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `user_type` varchar(255) DEFAULT NULL,
        `phone` varchar(50) DEFAULT NULL,
        `status` varchar(50) DEFAULT NULL,
        `email` varchar(30) DEFAULT NULL,
        PRIMARY KEY (`id`)
      )


[2]    run bewlow node query to start application
       npm install --save
       nodemon main.js



[3]  Restful API

     ==> Task (1)  Parking manager can create a parking lot with desired parking spaces/slots

     Solution : First create parkingLot with capecity

     POST API : http://localhost:7000/nodeApi/v1/parkingLot/createParking

     req.body HEADER (TEXT/JSON) :

     {
        "parkingAddress": "ABC home town Bikaner rajansthan",
        "parkingType" : "Four-Wheeler",
        "parkingCapacity" : "10",
        "parkingName" : "Nathu Mall Parking",
     }

    for creating slot/space in particular parking_lot

    POST API : http://localhost:7000/nodeApi/v1/parkingLot/createParkingSlots
    req.body :
    {
      "vehicleNumber": "RJ23 2256",
      "parkingLotId" : 1,
      "parkingOccupied" : "true",
      "parkingSlotName" : "slot no 1"
    }





    ==>Task(2) User can park his vehicle in the nearest parking slot available (eg if parking slots are numbered 1,2,3....n, then we still start from 1 and pick the one that is available)

    solution : for assign parking_slot to  vechicle for first empty slot then assign to parking slot

    POST API : http://localhost:7000/nodeApi/v1/parkingLot/assignParkingSlots
    req.body  :

    { "vehicleNumber": "RJ-24-VJ-123" }



    ==>Task(3) User can unpark his vehicle

    solution : for sending vechicle number in request body ..then calculate the final bill according to per hour 10 rupee(configuration) Please Park your car atleast one Minutes beacause calculation use atleast 1 Minutes


    POST API : http://localhost:7000/nodeApi/v1/parkingLot/unParkVehicle

    req.body :

    { "vehicleNumber":"RJ23-RJ-2259" }


    ==> Task(4) automatically unpark your vehicle using above api and calculate final billing amount

        POST API : http://localhost:7000/nodeApi/v1/parkingLot/unParkVehicle

        req.body :

        { "vehicleNumber":"RJ23-RJ-2259" }

   ==================================================================================================================

    ==> Task(5) Parking manager can view his current parking lot status

    Solution : Please create a user and  set userType to ParkingManager before checking status of parkingLot

      POST API : http://localhost:7000/nodeApi/v1/parkingLot/createUser

      {
          "userType" : "ParkingManager",
          "name" : "Ravindra",
          "email" : "dhaka243@gmail.com",
          "phone" : "8572003844"
      }

      Reponse :
      {
          "statusCode": 200,
          "status": true,
          "message": "User Created",
          "parkingManagerid": 9
      }

    --------------------------------------------------
    check parking Status API
    GET API  : http://localhost:7000/nodeApi/v1/parkingLot/parkingStatus?parkingManagerId=1
    response :
    [{
        "status": "ACTIVE",
        "Vehicle": "",
        "slotName": "slot no 1",
        "slotId": 1,
        "occupied": "false"
    }]

    occupied == "true" mean parking is occupied and already a car is parked at slotId || occupied == "false" paring available to park new createParking


    ===============================================================================================================================================

  === Task(6) 6) Parking manager can put any parking space/slot into maintenance mode and back to working state at any time.

  soltion : if already status is ACTIVE so you can change to INACTIVE to put on hold  but only change the slot status when no car is park at that time mean occupied == "false"


  POST : http://localhost:7000/nodeApi/v1/parkingLot/changeParkingMode

  set value status to be 'INACTIVE' or 'MAINTENANCE'

  req.body : {
      "status" : "ACTIVE",
      "parkingLotId" : 1,
      "parkingManagerId" : 1
    }



  in case of face any problem ..please free feel to contact me @ dhaka243@gmail.com  
