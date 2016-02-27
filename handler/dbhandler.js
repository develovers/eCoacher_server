var RANDOM_CHALLENGE = 0;
var mongoose   = require('mongoose')
    , dbHost = '127.0.0.1:27017'
    , dbName = 'ecoacher'
    , db_lnk   = 'mongodb://'+dbHost+'/'+dbName;
var ObjectID = require('mongodb').ObjectID;

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

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

        this.getNumberOfChallengesTypes = function(onRetrieved)
        {
            db.collection('retos').count({}, function(err, count)
            {
                var nElements = count;
                if (onRetrieved)
                    onRetrieved(nElements);
            });
        };

        this.getNumberOfAcceptedChallenges = function(res, onRetrieved)
        {
            db.collection('usuario').count({}, function(err, count)
            {
                var nElements = count;
                if (err != null)
                    console.log('No se pudo obtener el número de retos aceptados ('+err+')');
                else
                    console.log('Obtenido numero de retos aceptados: '+count);

                if (onRetrieved)
                    onRetrieved(res, {"count":nElements});
            });
        };

        var createNewChallenge = function(idChallenge, res, onRetrieved)
        {
            var cursor = db.collection('retos').find({'retoID':idChallenge});

            cursor.each(function(err, doc)
            {
                if (err != null)
                {
                    console.log('error al crear un nuevo reto! ('+err+')');
                }
                else
                {
                    console.log('Reto creado con éxito');
                }


                if (doc != null)
                {
                    if (onRetrieved)
                    {
                        doc.nivel = 0;
                        doc.objetivo = randomInt(1, 3);
                        doc.completado = 0;
                        onRetrieved(res, doc);
                    }
                    console.dir(doc);
                }
                else
                {
                    console.log('Error al leer el reto ('+err+')');
                }
            });
        };

        this.retrieveNewChallenge = function(idChallenge, res, onRetrieved)
        {
            if (idChallenge == RANDOM_CHALLENGE)
            {
                this.getNumberOfChallengesTypes(function (count) {
                    createNewChallenge(randomInt(1, count + 1), res, onRetrieved);
                });
            }
            else
                createNewChallenge(idChallenge, res, onRetrieved);
        };

        this.retrieveAcceptedChallenges = function(index, res, onRetrieved)
        {
            var cursor = db.collection('usuario').find();
            var iteration = 0;
            cursor.each(function(err, doc)
            {
                var currentChallenge = doc;
                if (iteration == index)
                {//Hacemos esto para poder pedir secuencialmente. El efecto es más llamativo en el cliente.


                    if (err != null)
                    {
                        console.log("Error al obtener los retos de usario.");
                    }
                    else
                    {
                        console.log('Retos aceptados del usuario obtenidos con éxito.');
                    }

                    if (currentChallenge != null) {

                        var cursor = db.collection('retos').find({'retoID':currentChallenge.tipo});
                        cursor.each(function(err,doc)
                        {
                            if (err != null)
                            {
                                console.log("Error al obtener los retos tipo en el momento de procesar retos de usario.");
                            }
                            else
                            {
                                console.log('Tipos de reto obtenidos con éxito.');
                            }

                            if (doc != null && onRetrieved)
                            {

                                console.log('Hay contenido: ');
                                console.dir(doc);
                                //Completamos doc con la información de currentChallenge
                                doc.nivel = currentChallenge.nivel;
                                doc.objetivo = currentChallenge.objetivo;
                                doc.completado = currentChallenge.completado;

                                onRetrieved(res, doc);
                            }

                        });
                    }
                    else
                    {
                        console.log('Error al leer el reto ('+err+')');
                    }
                }

                iteration++;
            });

        };

        this.acceptNewChallenge = function(challengeJson, res, onRetrieved)
        {
            var convertedElement = {'tipo':challengeJson.retoID, 'nivel':challengeJson.nivel,
            'objetivo':challengeJson.objetivo, 'completado':challengeJson.completado};
            console.dir(convertedElement);
            db.collection('usuario').insertOne(convertedElement, function (err, result)
            {
                if (err != null)
                {
                    console.log('Error al escribir el registro en el metodo de aceptar reto:' + err);
                    console.dir(challengeJson);
                }
                else
                {
                    console.log('Reto aceptado!');
                    onRetrieved(res, result);
                }
            });
        };

        this.removeChallenge = function(objectId, res, onRetrieved)
        {
            console.dir(objectId);
            db.collection('usuario').deleteOne({'_id':objectId}, function (err, result)
            {
                if (err != null)
                {
                    console.log('Error al eliminar el registro en el metodo de borrar reto:' + err);
                    console.dir(objectId);
                }
                else
                {
                    console.log('Reto eliminado con éxito!');
                    onRetrieved(res, result);
                }
            });
        };

        this.setChallengeCompleted = function(objectId, res, onUpdated)
        {
            var test = new ObjectID(objectId);
            console.dir(objectId);
            console.dir(test);
            console.log(test.id);
            db.collection('usuario').updateOne(
                { "_id" : test},
                {
                    $set:{'completado': 100}
                },
                function(err, results) {
                    if (err != null) {
                        console.log('Error al colocar el reto en modo completo ('+err+')');
                        console.dir(results);
                    }
                    else
                    {
                        console.log('Reto colocado como completo con éxito.');
                        onUpdated(res, results);
                        console.dir(results);
                    }
                });
        };

        this.isConnected = function()
        {
            return connected;
        };
    }
};