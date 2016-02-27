var RANDOM_CHALLENGE = 0;
var RANDOM_COMMENT = 0;

var mongoose   = require('mongoose')
    , dbHost = '127.0.0.1:27017'
    , dbName = 'ecoacher'
    , db_lnk   = 'mongodb://'+dbHost+'/'+dbName;

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

        this.getNumberOfComments = function(onRetrieved)
        {
            db.collection('comentarios').count({}, function(err, count)
            {
                var nElements = count;
                if (err != null)
                    console.log('No se pudo obtener el número de comentarios ('+err+')');
                else
                    console.log('Obtenido numero de comentarios: '+count);

                if (onRetrieved)
                    onRetrieved({"count":nElements});
            });
        };

        var getLastUid = function(onLastUidRetrieved)
        {
            var cursor = db.collection('lastuid').find({'id':0});

            cursor.each(function(err, doc)
            {
                console.log('Mirando lastUID');
                if (err == null && doc != null)
                {
                    if (onLastUidRetrieved)
                        onLastUidRetrieved(doc.uid);
                }

            });
        };

        var saveLastUid = function(lastUid)
        {
            db.collection('lastuid').updateOne(
                { "id" : 0},
                {
                    $set:{'uid': lastUid}
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
                    getLastUid(function(lastUid)
                    {
                        if (lastUid == null)
                            lastUid = 0;

                        lastUid++;
                        if (onRetrieved)
                        {
                            doc.uid = lastUid;
                            doc.nivel = 0;
                            doc.objetivo = randomInt(1, 3);
                            doc.completado = 0;
                            onRetrieved(res, doc);
                        }

                    });
                }
                else
                {
                    console.log('Error al leer el reto ('+err+')');
                }
            });
        };

        var createNewComment = function(idComment, res, onRetrieved)
        {
            console.log("Creando comentario de id: "+idComment);
            var cursor = db.collection('comentarios').find({'commentID':idComment});

            cursor.each(function(err, doc)
            {
                if (err != null)
                {
                    console.log('error al crear un nuevo comentario! ('+err+')');
                }
                else
                {
                    console.log('Comentario creado con éxito');
                }


                if (doc != null)
                {
                    onRetrieved(res, doc);
                }
                else
                {
                    console.log('Error al leer el comentario ('+err+')');
                }
            });
        };

        this.retrieveComment = function(idComment, res, onRetrieved)
        {
            if (idComment == RANDOM_COMMENT)
            {
                this.getNumberOfComments(function (countJSON) {
                    var count = countJSON.count;
                    var id = randomInt(1, count + 1);
                    createNewComment(id, res, onRetrieved);
                });
            }
            else
                createNewComment(idComment, res, onRetrieved);
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

                                //Completamos doc con la información de currentChallenge
                                doc.uid = currentChallenge.uid;
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
            var convertedElement = {'uid':challengeJson.uid, 'tipo':challengeJson.retoID, 'nivel':challengeJson.nivel,
            'objetivo':challengeJson.objetivo, 'completado':challengeJson.completado};
            db.collection('usuario').insertOne(convertedElement, function (err, result)
            {
                if (err != null)
                {
                    console.log('Error al escribir el registro en el metodo de aceptar reto:' + err);
                }
                else
                {
                    console.log('Reto aceptado!');
                    saveLastUid(convertedElement.uid);
                    onRetrieved(res, result);
                }
            });
        };

        this.removeChallenge = function(objectId, res, onRetrieved)
        {
            db.collection('usuario').deleteOne({'uid':objectId}, function (err, result)
            {
                if (err != null)
                {
                    console.log('Error al eliminar el registro en el metodo de borrar reto:' + err);
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
            db.collection('usuario').updateOne(
                { "uid" : objectId},
                {
                    $set:{'completado': 100}
                },
                function(err, results) {
                    if (err != null) {
                        console.log('Error al colocar el reto en modo completo ('+err+')');
                    }
                    else
                    {
                        console.log('Reto colocado como completo con éxito.');
                        onUpdated(res, results);
                    }
                });
        };

        this.isConnected = function()
        {
            return connected;
        };
    }
};