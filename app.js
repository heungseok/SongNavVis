/**
 * Created by heungseok2 on 2017-03-21.
 */
var express = require('express');
var app = express();    // router init
var http = require('http').Server(app);

var bodyParser = require('body-parser'); // body parsing middleware for parsing POST body


// Use Python shell
var PythonShell = require('python-shell'); // init python shell module.

// python script file path
var myPythonScriptPath = '/router/test.py';
// var pyshell = new PythonShell(myPythonScriptPath);


app.use(bodyParser.urlencoded({ extended : false}));


// var world = require('./js/server_world');

app.use('/js', express.static(__dirname + '/js'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/router', express.static(__dirname + '/router'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/index_bufferGeo.html', function (req, res) {
    res.sendFile(__dirname + '/index_bufferGeo.html');
});

app.get('/form_receiver', function (req, res) {
    var query1 = req.query.query1;
    var query2 = req.query.query2;
    res.send("hello get! " + query1 + query2);
});

app.post('/form_receiver', function (req, res) {
    var query1 = req.body.query1;
    var query2 = req.body.query2;
    res.send("hello post! " + query1 + query2);
});

app.post('/songParser', function (req, res) {
    console.log('post receive');

    var request = req.body['msg[]'];

    var parameter = [];

    // validate array
    for(var i=0; i<request.length; i++){
        if(request[i] == '')
            continue;
        parameter.push(request[i]);
    }
    request.length = 0;
    console.log(parameter);

    PythonShell.run('/router/test.py', parameter, function (err, results) {
        if(err) throw err;

        console.log('finished, results: %j', results);

        // send the result as json
        res.send({result:true, msg: JSON.parse(results[0])});

    });

});



http.listen(7777, function(){
    console.log("Server Running and Listen to port 7777");
});