var _ = require("lodash"),
    app = (module.exports = require("express")()),
    flagerr = false,
    functions = require("./functions"),
    config = require("../config/dbConfig");
    exceptions = functions.exception,
    routeErrorMessage = "sorry we are busy!";
var cors = require("cors");
// load routes after categories have been cached
require("./initialize/index.js").load(function(err) {
    if (err) {
        flagerr = true;
    }
    /**
     * Now that all the necessary middlewares are in place,
     * mount various apps
     */
    require(__dirname + "/routes/").forEach(function(a) {
        app.use(a.prefix, a.app);
    });

    // initial app load check
    if (!flagerr) {
        console.log("routes mounted");
        /**
         * will hit this part if no error is there and no route is matched
         **/
        app.use(function(req, res) {
            res.send({
                "status" : false,
                "code" : 404,
                "message" : "Page not found.",
                "data" : []
            });
        });
    } else {
        app.use(function(req, res) {
            exceptions.customException(req, res, routeErrorMessage, 500);
        });
    }
});
