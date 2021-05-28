var express = require('express')
const session = require("express-session");
const cors = require("cors");
const app = express();
const config = require("./config/dbConfig");
var bodyParser = require('body-parser');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Cookie, Access-Control-Allow-Origin,*"
    );
    // res.header("Access-Control-Allow-Credentials", true);

    // intercept OPTIONS method
    if ("OPTIONS" == req.method) {
        res.status(200).send("");
    } else {
        next();
    }
});
// parse application/json
app.use(bodyParser.json({limit: '50mb'}));
app.use(require("./server/routes"));

app.listen(7000, () =>
  console.log(`CMS app listening on port 7000`),
);
