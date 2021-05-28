var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var db_config_new = {
    host: "127.0.0.1",//QA IP changed
    user: "root",
    password: "root",
    database: "parking_lot",
    port : 3306
};

var connection = {};

connection.createConn = function(){
    var con = handleDisconnect();
    return con;
};

function handleDisconnect() {
    var con = mysql.createConnection(db_config_new);
    console.log("helloconnectDB" + con);                                                   // the old one cannot be reused.
    con.connect(function(err) {                             // The server is either down
      if(err) {                                             // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);                 // We introduce a delay before attempting to reconnect,
      }
     console.log("Connection established");                // to avoid a hot loop, and to allow our node script to
    });                                                     // process asynchronous requests in the meantime
                                                            // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {         // Connection to the MySQL server is usually
        handleDisconnect();                                 // lost due to either server restart, or a
      } else {                                              // connnection idle timeout (the wait_timeout
        throw err;                                          // server variable configures this)
      }
    });

    return con;
};

connection.closeConn = function(con){
    if(con){
      con.end(function(err){
        if(err) throw err;
      });
    }
};


module.exports = connection;
