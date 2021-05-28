var _ = require('lodash'),
	functions = require(__dirname + '/../../functions'),
	controllers = require(__dirname + '/../../controllers'),
	customException = functions.exception;
var test = controllers.test,
	testData = test.apiCall.testData,
	testData1 = test.apiCall.testData1;

module.exports = {
	testData: function(req, res, next){
		testData(req.query).then((data) => {
			res.send(data);
		}).catch(function (err) {
			customException.customExceptionWithError(req, res, err);
		})
	},
	testData1 : function (req, res, next) {
		testData1(req.body).then((data) => {
			res.send(data);
		}).catch(function (err) {
			customException.customExceptionWithError(req, res, err);
		})
	}
}
