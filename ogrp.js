var Converter = require("csvtojson").Converter;
var request = require('request');
var Ogrp = function(gtfsFeedPath, onLoad) {
  function loadDataFromCsv(path) {
    return new Promise((resolve, reject) => {
      var converter = new Converter({});
      converter.fromFile(path, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  this.onGtfsLoad = onLoad;

  var Routes;
  this.getRoutes = function() {
    return Routes;
  };

  var Stops;
  this.getStops = function() {
    return Stops;
  }

  loadDataFromCsv(gtfsFeedPath + 'routes.txt')
    .then(routes => {
      Routes = routes;
      return loadDataFromCsv(gtfsFeedPath + 'stops.txt');
    })
    .then(stops => {
      Stops = stops;
      return new Promise((resolve, reject) => {
        this.onGtfsLoad();
        resolve();
      });
    })
    .catch(error => {
      //console.log(error);
    });

  this.getNearestStops = function(lat, lon) {
    var radius = 0.02; // magic
    var result = [];
    Stops.reduce((a, b) => {
      if ( Math.sqrt(Math.pow(a.stop_lat - lat, 2) + Math.pow(a.stop_lon - lon, 2) ) < radius  ) {
        result.push(a);
      }
      return b;
    });
    return result;
  };

  this.getForecastByStop = function(stopId, cb) {
    var options = {
      url :'http://transport.orgp.spb.ru/Portal/transport/internalapi/forecast/bystop?stopID=' + stopId,
      headers: { 'Content-Type': 'application/json' },
      json: true
    };
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        cb(null, body);
      } else {
        cb(err);
      }
    });
  };
};

module.exports = Ogrp;
