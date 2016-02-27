var express    = require('express');        // call express

var printResult = function(res, pJSON)
{
    res.send(pJSON);
};



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
            router.get('/getNewChallenge', function(req, res) {
                var id = 0;

                if (req.query.id)
                    id = parseInt(req.query.id);

                dbHandler.retrieveNewChallenge(id, res, printResult);
            });

            router.get('/getNumberOfAcceptedChallenges', function(req, res) {
                dbHandler.getNumberOfAcceptedChallenges(res, printResult);
            });

            router.get('/getAcceptedChallenge', function(req, res) {
                dbHandler.retrieveAcceptedChallenges(parseInt(req.query.index), res, printResult);
            });

            router.get('/getNumberOfAcceptedChallenges', function(req, res) {
                dbHandler.getNumberOfAcceptedChallenges(res, printResult);
            });

            router.get('/getNewComment', function(req, res) {
                var id = 0;

                if (req.query.id)
                    id = parseInt(req.query.id);

                dbHandler.retrieveComment(id, res, printResult);
            });

            router.get('/acceptNewChallenge', function(req, res) {
                dbHandler.acceptNewChallenge(JSON.parse(req.query.challengeJSON), res, printResult);
            });

            router.get('/setChallengeCompleted', function(req, res) {
                dbHandler.setChallengeCompleted(JSON.parse(req.query.objectID), res, printResult);
            });

            router.get('/removeChallenge', function(req, res) {
                dbHandler.removeChallenge(JSON.parse(req.query.objectID), res, printResult);
            });
        };
    }
};