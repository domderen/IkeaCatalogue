var signing = require('./signing');
var fs = require('fs');
var nconf = require('nconf');
var express = require ('express');
var bodyParser = require('body-parser');

var configFilePath = __dirname + '/config.json';

console.log('config file path: ' + configFilePath);

nconf.argv()
  .env()
  .file({ file: configFilePath });

nconf.use('file', { file: configFilePath });
nconf.load();

console.log('userGuid: ' + nconf.get('userGuid'));
console.log('apiKey: ' + nconf.get('apiKey'));

nconf.set('userGuid', nconf.get('userGuid'));
nconf.set('apiKey', nconf.get('apiKey'));

nconf.save(function (err) {
  if(err) {
    console.log(err);
  } else {
    fs.readFile(configFilePath, function (err, data) {
      console.log('Config file contents:');
      console.dir(JSON.parse(data.toString()))
    });
  }
});

var query = {"input":{"webpage/url":"http://cdn.import.io/test/pages/basic/index.html"},"connectorGuids": ["d50aff7b-ad19-4f64-ab1a-1e8f9a1bb249"]};

console.log();

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', function (req, res) {
  console.log('POST parameters:');
  console.log(req.body);

  var query = req.body.query;
  var signingResult = signing.sign(query, nconf.get('userGuid'), nconf.get('apiKey'));

  console.log(signingResult);

  res.set('Content-Type', 'tapplication/json');
  res.send({digest: signingResult.digest});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

