//import-external
const async = require('async');

//import-internal
const SessionService = require('../AuthenticationManagement/SessionService.js');
const DatabaseService1 = require('../Database/DatabaseService1.js');

function TotalbattleController() {

    this.getCountOfBattle = function (req,res) {
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

        /*getCountFromDB will connecto databaseService to get the count*/
        function getCountFromDB(req, callback) {
            DatabaseService1.getCountFromDB().then(function (result) {
               
                 callback(null, result);
            }).catch((err) => {
               
                 callback(err);
            })
        }

        if (ssoToken) {

            async.waterfall([
                verifyAuthentication,
                getCountFromDB

            ], function (err, responseObject) {
                if (err) {
                    return res.send(err);
                }
                else {
                    var Success = {}
                    Success.TotalBattlesOccured = responseObject;
                    res.status(200);
                    return res.send(Success);
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

module.exports = new TotalbattleController()