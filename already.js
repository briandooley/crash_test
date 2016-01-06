var mbaasApi = require('fh-mbaas-api');

function saveit(cb) {
  // Save a value to the cache
var options = {
  "act": "save",
  "key": "foo", // The key associated with the object
  "value": "bar", // The value to be cached, must be serializable
  "expire": 60 // Expiry time in seconds. Optional
};
mbaasApi.cache(options, cb);
}

function checkit(cb) {
// Load a value from the cache
var options = {
  "act": "load",
  "key": "foo" // key to look for in cache
};
mbaasApi.cache(options, function (err, res) {
  if (err) {
    console.error(err.toString());
    return cb(err, false);
  }
  console.log('aleady - res:', res);
  return cb(null, (res === "bar"));
});
}

exports.saveit = saveit;
exports.checkit = checkit;
