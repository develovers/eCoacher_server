// Let's load the framework modules
var app = require('./handler/apphandler');
var db = require('./handler/dbhandler');
var router = require('./controller/routercontroller');

var defaultPort = 3000;

var dbHandler = new db.DBHandler();
var routerHandler = new router.RouterHandler(dbHandler);
var appHandler = new app.APPHandler('/', routerHandler, defaultPort);

routerHandler.configureRoutes();

dbHandler.connectToDB(function (){
    console.log('ok, is connected!');
    appHandler.disableAccessControl();
    appHandler.run();
});