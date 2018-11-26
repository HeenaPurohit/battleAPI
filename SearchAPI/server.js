//import-external
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//import-internal
let config = require('./config.json');
let SearchController = require('./SearchController.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));

app.get('/search', function (req, res) {

    SearchController.Search(req, res);

})

var server = app.listen(config.PORT, function () {
    var host = "localhost"
    var port = config.PORT

    console.log("App Listening on PORT " + port)
})