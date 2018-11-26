//import-external
const async = require('async');

//import-internal
const SessionService = require('../AuthenticationManagement/SessionService.js');

const DatabaseService1 = require('../Database/DatabaseService1.js');


function ListBattleLocationController() {

    this.getBattleLocation = function (req, res) {
        let ssoToken = req.headers['sso-token'];


        /* verifyAuthentication checks
         whether the user is authorized 
        to access API or not */
        function verifyAuthentication(callback) {
            SessionService.verifyToken(ssoToken, function (result) {
                if (!result) {

                    errorMessage.errorMessage = "Session is not valid "; //error message for invalid session

                    return callback(errorMessage);
                }
                else {
                    return callback(null, req)  
                }
            })
        }

        /*listAllBattleLocation will list down all the location and 
        send as a final response*/
        function listAllBattleLocation(req, callback) {
            DatabaseService1.listAllBattleLocationFromDB().then(function (result) {

                let response = {};
                response.battleLocation = result;
                return callback(null, response)

            }).catch((err) => {
                res.status(500);
                res.send(err);
            })
        }

        if (ssoToken) {

            async.waterfall([
                verifyAuthentication,
                listAllBattleLocation
            ], function (err, responseObject) {
                if (err) {
                    return res.send(err); //send error as the response
                }
                else {
                    res.status(200);
                    return res.send(responseObject); //send final result to user
                }
            })
        }
        else {
            var err = {};
            err.Message = "SSToken is missing in the header";
            res.status(400);

            return res.send(err); //error message, if sso-token is not passed the request
        }

    }

}

module.exports = new ListBattleLocationController();

