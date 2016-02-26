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
                dbHandler.retrieveChallenge(randomInt(1, 5), res, printResult);
            })
        };
    }
};