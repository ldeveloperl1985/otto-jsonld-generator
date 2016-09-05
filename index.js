var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var jsonfile = require('jsonfile');
var jsonSignature = path.join(__dirname, './jsonSignature.js');
var dataset = path.join(__dirname, './dataset.json');
var settings = path.join(__dirname, './settings.js');

jsonfile.readFile(jsonSignature, function(err, obj) {

    var datasetArray = [];

    for (var i = 0; i < settings.counter; i++) {
        var fedId = generateUUID();
        var entityId = generateUUID();
        var orgId = generateUUID();

        var newJson;
        newJson = JSON.stringify(obj).replace(/{id}/g, fedId);
        newJson = newJson.replace(/{eId}/g, entityId);
        newJson = newJson.replace(/{oId}/g, orgId);
        datasetArray.push(JSON.parse(newJson));
    }

    fs.writeFile("dataset.json", JSON.stringify(datasetArray), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Dataset Created Successfully - Open URL in browser http://localhost:" + settings.port + "/");
        }
    });

})

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

app.get('/', function(req, res) {
    jsonfile.readFile(dataset, function(err, obj) {
        if (err) {
            console.log("Error ==>" + JSON.stringify(err));
            res.status(500).send(JSON.stringify(err));
        } else {
            console.log("Success ==>" + JSON.stringify(obj));
            res.status(200).send(obj);
        }
    });
});
app.listen(settings.port);
