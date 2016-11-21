const Converter = require("csvtojson").Converter;
const request = require('request');
const path = require('path');

let Ogrp = function(gtfsFeedPath, onLoad) {

  function loadDataFromCsv(gtfsPath) {
    return new Promise((resolve, reject) => {
      if (typeof gtfsPath != 'string') reject(new TypeError('Path must be a String'));
      let converter = new Converter({});
      converter.fromFile(gtfsPath, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  let onGtfsDataLoad = onLoad;

  loadDataFromCsv(path.join(gtfsFeedPath, 'routes.txt'))
    .then(routes => {
      Routes = routes;
      return loadDataFromCsv(path.join(gtfsFeedPath, 'stops.txt'));
    })
    .then(stops => {
      Stops = stops;
      return new Promise((resolve, reject) => {
        onGtfsDataLoad();
        resolve();
      });
    })
    .catch(error => {
      console.log(error);
    });

  let Routes = null;
  this.getRoutes = function() {
    return Routes;
  };
  this.getRouteById = function(id) {
    if (!Routes) throw new Error('Routes were not loaded');
    if (id == null) throw new TypeError('Route id argument is required');
    if (isNaN(id)) throw new TypeError('Route id must be a Number');
    for (let i = 0; i < Routes.length; i++) {
      if (Routes[i].route_id == id) return Routes[i];
    }
    return null;
  }
  this.getRoutesByQuery = function(query) {
    if (!Routes) throw new Error('Routes were not loaded');
    if (query == null) throw new TypeError('Query argument is required');
    if (typeof query != 'string') {
        throw new TypeError('Query must be a String or a Number');
    }
    if ((query.length == 0) || (query.length > 15)) {
      throw new TypeError('Query length must be more than 0 and less than 15')
    };

    let result = [];
    if (isNaN(query)) {
      for (let i = 0; i < Routes.length; i++) {
        if (Routes[i].route_short_name.toString().match(new RegExp('\\b' + query))) {
          result.push(Routes[i]);
        }
      }
    } else {
      for (let i = 0; i < Routes.length; i++) {
        if (Routes[i].route_short_name.toString().match(new RegExp('\\b' + query + '\\b'))) {
          result.push(Routes[i]);
        }
      }
    }
    return result;
  }

  let Stops = null;
  this.getStops = function() {
    return Stops;
  }
  this.getStopById = function(id) {
    if (!Stops) throw new Error('Stops were not loaded');
    if (id == null) throw new TypeError('Stop id argument is required');
    if (isNaN(id)) throw new TypeError('Stop id must be a Number');
    for (let i = 0; i < Stops.length; i++) {
      if (Stops[i].stop_id == id) return Stops[i];
    }
    return null;
  }

  this.getNearestStops = function(radius, lat, lon) {
    if (!Stops) throw new Error('Stops were not loaded');
    if (radius <= 0 ) {
      throw new TypeError('Radius must be more than zero');
    }
    if (!lat || !lon) {
      throw new TypeError('Lattitude and longitude are required');
    }
    if (isNaN(lat) || isNaN(lon) || isNaN(radius)) {
      throw new TypeError('Lattitude, longitude and raduis must be numbers');
    }
    let R = 6371e3;
    lat *= Math.PI / 180;
    lon *= Math.PI / 180;
    function countDistance(stopLat, stopLon) {
      stopLon *= Math.PI / 180;
      stopLat *= Math.PI / 180;
      let x = (stopLon - lon) * Math.cos((stopLat + lat) / 2);
      let y = (stopLat - lat);
      return Math.sqrt(x * x + y * y) * R;
    }
    let result = [];
    Stops.reduce((a, b) => {
      let distance = countDistance(a.stop_lat, a.stop_lon);
      if (distance < radius) {
        a.distance = distance;
        result.push(a);
      }
      return b;
    });
    result.sort((a, b) => {
      if (a.distance > b.distance) return 1;
      if (a.distance < b.distance) return -1;
      if (a.distance == b.distance) return 0;
    });
    return result;
  };

  this.getForecastByStopId = function(id, cb) {
    if (id == null) cb(new TypeError('Stop id argument is required'));
    if (isNaN(id)) cb(new TypeError('Stop id must be a Number'));
    let options = {
      url: 'http://transport.orgp.spb.ru/Portal/transport/internalapi/forecast/bystop?stopID=' + id,
      headers: { 'Content-Type': 'application/json' },
      json: true
    };
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        cb(null, body);
      } else {
        cb(error);
      }
    });
  };
};

module.exports = Ogrp;
