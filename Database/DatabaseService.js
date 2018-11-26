//import-external
const MongoClient = require('mongodb').MongoClient;

//import-internal
const config = require('./config.json');

var url = "mongodb://HeenaPankajPurohit:01041993heena@ds024778.mlab.com:24778/battledb";

//var url = "mongodb://username:password@ds024778.mlab.com:24778/collectionName";

exports.listAllBattleLocationFromDB = function () {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) {
                reject(err)
            }
            else {
                var dbo = db.db("battledb");
                dbo.collection("battles").find({}, { projection: { _id: 0, name: 1, location: 1 } }).toArray(function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                    db.close();
                });
            }
        });

    })
}

exports.searchBattleDetails = function (king, location, type) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) {
                reject(err)
            }
            else {
                var dbo = db.db("battledb");
                if (king !== undefined && location !== undefined && type != undefined) {
                    var query = {
                        $and: [
                            { "defender_king": king }, { "location": location }, { "battle_type": type }
                        ]
                    };
                    dbo.collection("battles").find(query).toArray(function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                        db.close();
                    });
                }
                else {
                    if (king !== undefined) {
                        var query = {
                            $or: [
                                { attacker_king: king }, { defender_king: king }
                            ]
                        };

                        dbo.collection("battles").find(query).toArray(function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                            db.close();
                        });
                    }
                }

            }
        });
    })
}
