var express    = require('express');        // call express

var printResult = function(res, pJSON)
{
    res.send(pJSON);
};

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


module.exports = {
    RouterHandler : function (pDBHandler)
    {
        var router = express.Router();
        var dbHandler = pDBHandler;

        this.getRouter = function()
        {
            return router;
        };

        this.configureRoutes = function()
        {
            router.get('/getChallenge', function(req, res) {
                dbHandler.getNumberOfChallenges(function(count)
                {
                    var id = randomInt(1, count+1);

                    if (req.query.id)
                        id = parseInt(req.query.id);

                    console.log("Retrieving from id \""+ id+"\"");
                    dbHandler.retrieveChallenge(id, res, printResult);
                });

            });

            router.get('/setChallengeCompleted', function(req, res) {
                var id = parseInt(req.query.id);
                dbHandler.setChallengeCompleted(id, res, printResult);
                //dbHandler.retrieveChallenge(randomInt(1, 5), res, printResult);
            });
        };
    }
};