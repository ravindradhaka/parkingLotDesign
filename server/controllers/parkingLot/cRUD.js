const httpRequest = require('../../lib/requestHttp');
var request = require('request');

module.exports = {
	getApiCalls : (getUrl, param, redisKey) => {
		return redisKey ? (httpRequest(getUrl, param, redisKey)) : httpRequest(getUrl, param);
	},
	postApiCalls : (postUrl, body) => {
		//return a promise
		let options = {
			uri: postUrl,
			method: "POST",
			body: body,
			json: true
		}
		return httpRequest(options);
	},
	postApiCallsWithParams : (postUrl, param, body) => {
		//return a promise
		let options = {
			uri: postUrl,
			method: "POST",
			body: body,
			json: true,
			hasParams: true
		}
		return httpRequest(options, param);
	},
	postApiCallsFormData : (postUrl, formData) => {
		request.post({ url: postUrl, formData: formData }, function optionalCallback(err, httpResponse, body) {
			console.log("httpresponse = ", httpResponse);
			if (err) {
				return;
			}
			return (body);
			console.log('Upload successful!  Server responded with:', body);
		});
	}
}
