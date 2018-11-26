//import-External
const async = require('async');

//import-internal
const SessionService = require('../AuthenticationManagement/SessionService.js');
const DatabaseService1 = require('../Database/DatabaseService1.js');

function StatsController() {
    this.getStats = function (req, res) {
        let ssoToken = req.headers['sso-token'];

        
        /* verifyAuthentication checks
             whether the user is authorized 
            to access API or not */
        function verifyAuthentication(callback) {
            SessionService.verifyToken(ssoToken, function (result) {
                if (!result) {

                    errorMessage.errorMessage = "Session is not valid ";

                    return callback(errorMessage);
                }
                else {
                    return callback(null, req)
                }
            })
        }

        /*getStatsFromDB will connect to databaseService modules to get the output */
        function getStatsFromDB(req, callback) {

            DatabaseService1.getStatsFromDB().then(function (result) {
               
                callback(null, result);
            }).catch((err) => {
                
                callback(err);
            })
        }

        if (ssoToken) {

            async.waterfall([
                verifyAuthentication,
                getStatsFromDB
            ], function (err, responseObject) {
                if (err) {
                    return res.send(err);  //error message
                }
                else {
                    res.status(200); 
                    return res.send(responseObject); //final stats result
                }
            })
        }
        else {
            var err = {};
            err.Message = "SSToken is missing in the header";
            res.status(400);

            return res.send(err);
        }
    }
}

module.exports = new StatsController();