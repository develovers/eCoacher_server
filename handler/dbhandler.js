var mongoose   = require('mongoose')
    , dbHost = '127.0.0.1:27017'
    , dbName = 'ecoacher'
    , db_lnk   = 'mongodb://'+dbHost+'/'+dbName;


module.exports = {
    DBHandler : function () {
        var that = this;
        var db = null;
        var connected = false;
        var gpsSchema = new mongoose.Schema({
            latitud: {type: String},
            longitud: {type: String}
        });

        this.setConnected = function(pConnected)
        {
            connected = pConnected;
        };

        this.connectToDB = function (onConnected)
        {
            db = mongoose.createConnection(db_lnk, function (err, res)
            {
                globalErr = err;
                if (err)
                    console.log('Error code: ' + err + res)
                else
                {
                    connected = true;
                    if (onConnected)
                        onConnected();
                }
            });
        };

        /**
         * Configures the current db collection
         */
        this.configureGPSCollection = function()
        {
            module.exports = db.model('gps', gpsSchema);

            var registro1 = {
                'latitud' : '12312',
                'longitud': '11111'
            }

        };


        this.retrieveChallenge = function(idChallenge, res, onRetrieved)
        {
            var cursor = db.collection('retos').find({'retoID':idChallenge});

            cursor.each(function(err, doc)
            {
                if (err != null)
                {
                    console.log('error!');
                }

                if (doc != null) {
                    if (onRetrieved)
                        onRetrieved(res, doc);

                    console.dir(doc);
                }
                else
                {
                    console.log('Error al leer el reto ('+err+')');
                }
            });
        };

        this.setChallengeCompleted = function(idChallenge, res, onUpdated)
        {
            db.collection('retos').updateOne(
                { 'retoID' : idChallenge},
                {
                    $set:{'completado': 1}
                },
                function(err, results) {
                    console.log(err);
                    console.log(results);
                    if (!err)
                    {
                        onUpdated(res, results);
                    }
                });
        };

        this.isConnected = function()
        {
            return connected;
        }
    }
};