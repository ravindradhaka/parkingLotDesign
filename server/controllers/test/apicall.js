const httpRequest = require('../../lib/requestHttp');

module.exports = {
	testData: function (param) {
		//return a promise
		var getUrl = params.SERVER.CMS_URL + params.URL_SEPERATOR + url.cms.GET_STATIC_TEXT ;
		return httpRequest(getUrl, param);
	},
	testData1: function (body) {
		//return a promise
		var postUrl = params.SERVER.FEEDBACK_URL + params.URL_SEPERATOR + url.cms.CMS_QUESTION_API;
		let options = {
			uri: postUrl,
			method: "POST",
			body: body,
			json: true
		}
		return httpRequest(options);
	}
}
