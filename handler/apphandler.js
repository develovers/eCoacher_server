var express    = require('express');        // call express
var bodyParser = require('body-parser');

module.exports = {
    APPHandler : function (pRouterPrefix, pRouterHandler, pPort)
    {
        var app = express();                 // define our app using express
        var that = this;
        var router = pRouterHandler.getRouter();
        var routerPrefix = pRouterPrefix;
        var port = pPort;

        this.disableAccessControl = function()
        {
            // Add headers
            app.use(function (req, res, next) {

                // Website you wish to allow to connect
                res.setHeader('Access-Control-Allow-Origin', '*');

                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                // Request headers you wish to allow
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                // Set to true if you need the website to include cookies in the requests sent
                // to the API (e.g. in case you use sessions)
                res.setHeader('Access-Control-Allow-Credentials', true);

                // Pass to next layer of middleware
                next();
            });
        }

        this.run = function ()
        {
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
            app.use(routerPrefix, router);

            console.log("Running on port " + port);
            app.listen(port);
        };
    }
};