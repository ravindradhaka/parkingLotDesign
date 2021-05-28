var app = module.exports = require('express')();
var apps = module.exports = [
	{ prefix: '/nodeApi/v1', app: require("./v1") },
];
