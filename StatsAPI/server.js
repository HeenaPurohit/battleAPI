//import-external
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//import-internal
let config = require('./config.json');
let StatsController = require('./StatsController.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));

app.get('/stats', function (req, res) {

    StatsController.getStats(req, res);

})

var server = app.listen(config.port, function () {
    var host = "localhost"
    var port = config.port

    console.log("App Listening on PORT " + port)
})