var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var already = require('./already.js');

// list the endpoints which you want to make securable here
var securableEndpoints;
// fhlint-begin: securable-endpoints
securableEndpoints = ['/hello'];
// fhlint-end

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// fhlint-begin: custom-routes
app.use('/hello', require('./lib/hello.js')());
// fhlint-end

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var server = app.listen(port, host, function() {
  console.log("App now started at: " + new Date() + " and listening on port: " + port); 
  setInterval(function() {console.log("checking exit trigger"); already.checkit(function(err, shouldexit){if(shouldexit){console.log("found exit trigger in cache!!"); throw new Error('cache says goodbye');} else {console.log("did not find exit trigger in cache")}});}, 1000);
  setTimeout(function() {console.log("setting exit trigger in cache"); already.saveit(function(){console.log("set exit trigger in cache");});}, 30000);
});
