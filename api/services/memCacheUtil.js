'use strict'
// Importing the required modules
const db = require("../models/sequelize"),
  op = db.Sequelize.Op,
  products = db.products;

let logger = require('../config/winston_Logger');
const { cities } = require("../controllers/vendorController");

logger = logger(module) // Passing the module to the logger

exports.memCacheUtil = function () {

  var Memcached = require('elasticache-client');
  var memcached = new Memcached('umart44-cache.zybpew.0001.aps1.cache.amazonaws.com:11211',{update_time: 1000*2, autodiscovery: true}/* , {update_time: 1000*2, autodiscovery: true} */);

  console.log(memcached);

  memcached.set('foo', 'bar', 10, function (err) { /* stuff */ });

  memcached.gets('foo', function (err, data) {
  console.log(data);
  });
    /* var memjs = require('memjs');
  
    var mc = memjs.Client.create('umart44-cache.zybpew.cfg.aps1.cache.amazonaws.com:11211',{
        failover: true,  // default: false
        timeout: 1,      // default: 0.5 (seconds)
        keepAlive: true  // default: false
      })
      
      mc.set('hello', 'memcachier', {expires:0}, function(err, val) {
        if(err != null) {
          console.log('Error setting value: ' + err)
        }
      })
      
      mc.get('hello', function(err, val) {
        if(err != null) {
          console.log('Error getting value: ' + err)
        }
        else {
          console.log(val.toString('utf8'))
        }
      }) */
}