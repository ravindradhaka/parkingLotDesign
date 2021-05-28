'use strict';
var _ =require('lodash');

var customException = {
	customExceptionWithMessage: function (req, res, status = false ,message, statusCode=500) {
		var errJSON = {
			status: status,
			code: statusCode,
			data: [],
			message: message
		}
		res.status(statusCode).send(errJSON);
	},
	customExceptionWithError: function (req, res, err) {
		var errJson = {};
		if(err.code == undefined){
			errJson.code = 400
		}else{
			if(typeof err.code === "string"){
				errJson.code = 500 
			}else{
				errJson.code = err.code
			}
		}
		errJson.status = err.status ==undefined ? false : err.status;
		errJson.data = err.data == undefined ? [] : err.data;
		errJson.message = err.message == undefined ? "" : err.message;
		
		res.status(errJson.code).send(errJson)
	}
}

module.exports = customException;
