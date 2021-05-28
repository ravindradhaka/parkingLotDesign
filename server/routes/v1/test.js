var express = require('express')
var app = module.exports = require('express')()
var router = express.Router()

var functions = require(__dirname + '/../../functions');
// var utils = functions.utils;
var resources = require(__dirname + '/../../resources')
var test = resources.test,
    testData = test.version1.testData,
    testData1 = test.version1.testData1;


router.get('/testdata', testData);
router.post('/testdata1',testData1);

app.use('/', router)
