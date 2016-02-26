// server.js

/*
// Creación de variables para cargar el modelo
var producto_schema = require('../models/producto')
    , Producto = db.model('Producto', producto_schema)

// BASE SETUP
// =============================================================================

// call the packages we need

// configure app to use bodyParser()
// this will let us get the data from a POST
 */

var gpsSchema = new mongoose.Schema({
    latitud: {type: String},
    longitud: {type: String}
});

module.exports = db.model('gps', gpsSchema);

var registro1 = {
    'latitud' : '12312',
    'longitud': '11111'
}

db.collection('gps').insertOne(registro1, function (err, result) {
    if (err)
        console.log('error: ' + err);
    else
        console.log('Registro insertado con éxito.');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);