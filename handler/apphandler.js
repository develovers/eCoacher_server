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