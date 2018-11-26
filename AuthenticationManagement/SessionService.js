//import-external
var njwt = require('njwt');
var key = "heenapurohit";

//import-interna1;
var config = require('./config.json');

module.exports = {

    /*generate token with claims params */
    generateSession: function () {
        var claims = {
            username: config.username,
            password: config.password
        }
        var jwt = njwt.create(claims, key)
        jwt.setExpiration();
        var token = jwt.compact();

        console.log(JSON.stringify(token));
        return token;
    },

    /* verifyToken verify the passed token */
    verifyToken: function (ssotoken, callback) {
        try {
            var verifiedJwt = njwt.verify(ssotoken, key);
            callback(true)
        }
        catch (err) {
            callback(false);
        }
    }

}