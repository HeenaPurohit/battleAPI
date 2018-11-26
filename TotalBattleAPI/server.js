//import-external
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//import-internal
let config = require('./config.json');
let TotalbattleController = require('./TotalbattleController.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));

app.get('/count', function (req, res) {

    TotalbattleController.getCountOfBattle(req, res);

})

var server = app.listen(config.port, function () {
    var host = "localhost"
    var port = config.port

    console.log("App Listening on PORT " + port)
})