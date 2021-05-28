'use strict';
const log = require('metalogger')();
const request = require('request');
const Promise = require('bluebird');
const DEFAULT_METHOD = "GET";
// const cachehandler = require('./redis');

module.exports = function(options, param, cacheKey, cachePrefix, cacheTTL){
	if(typeof options == "string"){
		if(param && typeof param === "object"){
			for(let key in param){
				options += "&" + key + "=" + encodeURIComponent(param[key]);
			}
		}
		options = {uri:options};
	}
	if(typeof options == "object" && options.hasParams == true){
		if(param && typeof param === "object"){
			for(let key in param){
				options.uri += "&" + key + "=" + encodeURIComponent(param[key]);
			}
		}
	}
	console.log("request going for uri = ", options.uri);
	if(!options.method){
		options.method = DEFAULT_METHOD;
	}
	return new Promise((resolve, reject) => {
		if(cacheKey){
			let cacheObj = {
				key: cacheKey
			};
			if(cachePrefix){
				cacheObj.prefix = cachePrefix;
			}
			if(cacheTTL){
				cacheObj.ttl = cacheTTL;
			}
			cachehandler.getx(cacheObj).then((reply) => {
				if(!reply){
					makeCall(options, resolve, reject, cacheObj);
				}else{
					var ansObj = JSON.parse(reply);
					resolve(ansObj);
				}
			},(err) =>{
				makeCall(options, resolve, reject, cacheObj);
			})
		} else {
			makeCall(options, resolve, reject);
		}
	})
};
function makeCall(options, resolve, reject, cacheObj){
	log.debug("#requestHttp# in function makeCall");
	request(options, function(error, response, body) {
		var failJson = {
			"status" : false,
			"code" : 500,
			"message" : "Something went wrong.",
			"data" : []
		};
		var emptyJson = {
			"status" : false,
			"code" : 400,
			"message" : "Bad request.",
			"data" : []
		};
		if ((!error && response.statusCode == 200) && (response.body && (!response.body.code || response.body.code == 200))) {
			if(cacheObj){
				cacheObj.value = response.body;
				cachehandler.setx(cacheObj).then((reply) => {},(err) => { console.log(err) });
			}
			if(typeof response.body === "string") {
				resolve(JSON.parse(response.body));
			} else {
				resolve(response.body);
			}
		} else {
			if((!error && response.statusCode == 200) && !response.body){
				resolve(emptyJson);
			}
			failJson.code = response.statusCode;
			if(response.body){
				if(response.body.code && response.body.code != failJson.code){
					failJson.code = response.body.code;
				}else if(response.body.statusCode && response.body.costatusCodede != failJson.code){
					failJson.code = response.body.statusCode;
				}
				if(typeof response.body.status != "undefined"){
					failJson.status = response.body.status;
				}
				if(typeof response.body.message != "undefined"){
					failJson.message = response.body.message;
				}
				if(typeof response.body.data != "undefined"){
					failJson.data = response.body.data;
				}
			}
			reject(failJson);
		}
	});
}
