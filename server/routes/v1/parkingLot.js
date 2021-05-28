var express = require('express')
var app = module.exports = require('express')()
var router = express.Router()

var functions = require(__dirname + '/../../functions'),
    utils = functions.utils;
// var utils = functions.utils;
var resources = require(__dirname + '/../../resources');
var parkingLot = resources.parkingLot,
    createParkingSlots = parkingLot.version1.createParkingSlots,
    assignParkingSlots = parkingLot.version1.assignParkingSlots,
    unParkVehicle = parkingLot.version1.unParkVehicle,
    parkingStatus = parkingLot.version1.parkingStatus,
    changeParkingMode = parkingLot.version1.changeParkingMode,
    createUser = parkingLot.version1.createUser,
    createParking = parkingLot.version1.createParking;


router.post('/createParking', createParking);
router.post('/createParkingSlots',createParkingSlots);
router.post('/assignParkingSlots',assignParkingSlots);
router.post('/unParkVehicle',unParkVehicle);
router.post('/createUser',createUser)
router.get('/parkingStatus',utils.isParkingManager, parkingStatus);
router.post('/changeParkingMode',utils.isParkingManager, changeParkingMode);

app.use('/', router)
