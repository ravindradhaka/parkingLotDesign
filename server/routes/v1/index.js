var app = module.exports = require('express')();

app.use('/test', require('./test'));
app.use('/parkingLot', require('./parkingLot'));


  // ALTER TABLE parking_lot
  // ADD status varchar(50);
  //
  // CREATE TABLE parking_slot (
  //      `id` int NOT NULL AUTO_INCREMENT,
  //      `parking_slot_name` varchar(255) NOT NULL,
  //      `parking_type` varchar(255),
  //      `parking_occupied` varchar(10),
  //      `parking_lot_id` int(10),
  //      `status` varchar(20),
  //      `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_DATE(),
  //      `end_time` TIMESTAMP NOT NULL DEFAULT CURRENT_DATE(),
  //      PRIMARY KEY (id)
  //  );
