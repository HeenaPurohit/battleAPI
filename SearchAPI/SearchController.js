//import-external
const async = require('async');

//import-internal
const SessionService = require('../AuthenticationManagement/SessionService.js');

const DatabaseService1 = require('../Database/DatabaseService1.js');

function SearchController() {
    this.Search = function (req, res) {
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

        /*searchFromDatabase will connect to dbService module to get the result 
        as per the requested params*/
        function searchFromDatabase(req, callback) {
            let king = req.query.king;
            let location = req.query.location;
            let type = req.query.type

            DatabaseService1.searchBattleDetails(king, location, type).then(function (result) {
                if (result) {
                    return callback(null, result);
                }
                else {
                    let err = {};
                    err.Message = "inappropriate Request"; //if we send wrong query
                    return callback(err)
                }

            }).catch((err) => {
                return callback(err);
            })
        }

        if (ssoToken) {

            async.waterfall([
                verifyAuthentication,
                searchFromDatabase

            ], function (err, responseObject) {
                if (err) {
                    res.send(err); //send error as the response
                } else {
                    res.status(200);
                    res.send(responseObject); //send final result to user
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

module.exports = new SearchController();