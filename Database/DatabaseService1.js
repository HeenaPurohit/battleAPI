//import-External
let mongoose = require('mongoose');
require('./battle.js');

//import-Internal
const config = require('./config.json'); //config to read db credentials

//connection to mongoDB
var mongoDB = "mongodb://" + config.username + ":" + config.password + "@ds024778.mlab.com:24778/" + config.collectionName;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*listAllBattleLocationFromDB will connect to db and collect all the location*/
exports.listAllBattleLocationFromDB = function () {
    return new Promise(function (resolve, reject) {
        let battle = mongoose.model('battle');
        let location = [];
        battle.find({}, 'location -_id')
            .exec()
            .then(result => {

                result.forEach(item => {
                    if (item['location']) {
                        location.push(item['location'])
                    }
                })
                resolve(location); //resolving the location array
            }).catch(err => reject(err));
    })
}

/*searchBattleDetails will search on the basis of king,location,type,
if only king provided then it will perform or operation between attacker king and defender king
if king,type,location provided then it will perform and operation between them and or operation between king again*/

exports.searchBattleDetails = function (king, location, type) {
    return new Promise(function (resolve, reject) {
        let battle = mongoose.model('battle');
        if (king !== undefined && location !== undefined && type != undefined) {

            var query = {
                $and: [
                    { $or: [{ "attacker_king": { $regex: '.*' + king + '.*' } }, { "defender_king": { $regex: '.*' + king + '.*' } }] }, { "location": location }, { "battle_type": type }
                ]
            }; // query for and operation

            battle.find(query, '-_id')
                .exec()
                .then(result => {
                    resolve(result);//result of and operations
                }).catch(err => reject(err));
        }
        else {

            if (king !== undefined) {
                var query = {
                    $or: [
                        { "attacker_king": { $regex: '.*' + king + '.*' } }, { "defender_king": { $regex: '.*' + king + '.*' } }
                    ]
                }; // query for or operation

                battle.find(query, '-_id')
                    .exec()
                    .then(result => {
                        resolve(result); //result of or operations
                    }).catch(err => reject(err));
            } else {
                resolve(null);
            }
        }
    })
}

/*getCountFromDB will connect to mongoDB and get total number of documents*/
exports.getCountFromDB = function () {
    return new Promise(function (resolve, reject) {
        let battle = mongoose.model('battle');

        battle.countDocuments({}, (error, count) => {
            if (error) {
                reject(error);
            } else {
                resolve(count); //resolving the total count of document
            }
        })
    })
}

/*maxCount will return the element which is present at highest count*/
function maxCount(arr) {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length
        - arr.filter(v => v === b).length
    ).pop();
}

function statsFinalResult(result) {

    let most_active = {
        attacker_king: [],
        defender_king: [],
        region: [],
        name: []
    }

    let attacker_outcome = {
        win: 0,
        loss: 0
    }

    let battle_type = []

    let defender_sizing = [];

    result.forEach(item => {
        if (item['attacker_king'] && item['attacker_king'] !== undefined && item['attacker_king'] !== "") {
            most_active.attacker_king.push(item['attacker_king'].toString());
        }

        if (item['defender_king'] && item['defender_king'] !== undefined && item['defender_king'] !== "") {
            most_active.defender_king.push(item['defender_king'].toString());
        }

        if (item['region'] && item['region'] !== undefined && item['region'] !== "") {
            most_active.defender_king.push(item['region'].toString());
        }

        if (item['name'] && item['name'] !== undefined && item['name'] !== "") {
            most_active.name.push(item['name'].toString());
        }

        if (item['attacker_outcome'] == "win" && item['attacker_outcome'] != undefined) {
            attacker_outcome.win++;
        }

        if (item['attacker_outcome'] == "loss" && item['attacker_outcome'] != undefined) {
            attacker_outcome.loss++;
        }

        if (item['defender_size'] && item['defender_size'] !== undefined && item['defender_size'] !== null) {
            defender_sizing.push(item['defender_size']);
        }
    })

    let statsReult = {};
    let attacker_king = maxCount(most_active.attacker_king); //return most active attacker king.
    let defender_king = maxCount(most_active.defender_king); //return the most active defender king.
    let region = maxCount(most_active.region);               //return the region where most of the battle took place.
    let name = most_active.name;                             //return the unique name of all the battle
    let win = attacker_outcome.win;                          //return the total number won battle
    let loss = attacker_outcome.loss;                        //return the total number lose battle
    let sortedDefendersize = defender_sizing.sort();
    let average = (sortedDefendersize.reduce(function (a, b) { return a + b; })) / sortedDefendersize.length; //return the averaage of the  defender sizes.

    most_active.attacker_king = attacker_king;
    most_active.defender_king = defender_king;
    most_active.region = region;
    most_active.name = name;

    attacker_outcome.win = win;
    attacker_outcome.loss = loss;

    let defender_size = {};
    defender_size.average = average;
    defender_size.max = sortedDefendersize[sortedDefendersize.length - 1]; //return the max defendersize among all
    defender_size.min = sortedDefendersize[0];                             //return the mininmum defendersize amomg all

    statsReult.most_active = most_active;
    statsReult.attacker_outcome = attacker_outcome;
    statsReult.defender_size = defender_size;

    return statsReult; //final result as per the format
}

/* getStatsFromDB will get battle details from mongodb and evaluate the statistics*/
exports.getStatsFromDB = function () {
    return new Promise(function (resolve, reject) {
        let battle = mongoose.model('battle');
        battle.find({}, 'attacker_king defender_king region name attacker_outcome battle_type defender_size')
            .exec()
            .then(result => {
                if (result.length > 0) {
                    let stats = statsFinalResult(result); //evaluation of data

                    resolve(stats); // final stats result
                }
                else {
                    resolve(result);
                }
            }).catch(err => reject(err));

    })
}