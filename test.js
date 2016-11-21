let Ogrp = require('./ogrp');
let ogrp;
let assert = require('assert');
describe('Ogrp class', function() {
  before((done) => {
    ogrp = new Ogrp('../transport-telegram-bot/gtfs/', () => {
      done();
    });
  });

  describe('Routes methods', () => {
    it('should get all routes', (done) => {
      assert.notEqual(ogrp.getRoutes(), null);
      done();
    });

    it('should get route by id', (done) => {
      assert.equal(ogrp.getRouteById(1), null);
      assert.notEqual(ogrp.getRouteById(3260), null);
      done();
    });

    it('should get route by query', (done) => {
      assert.notEqual(ogrp.getRoutesByQuery('12345678'), null);
      assert.notEqual(ogrp.getRoutesByQuery('50'), null);
      ogrp.getRoutesByQuery('181');
      done();
    });
  });

  describe('Stops methods', () => {
    it('should get all stops', (done) => {
      assert.notEqual(ogrp.getStops(), null);
      done();
    });

    it('should get stop in radius (meters)', (done) => {
      assert.notEqual(ogrp.getNearestStops('1', '1', '3'), null);
      assert.notEqual(ogrp.getNearestStops(1, 59.935348, 30.325524), null);
      let stopsAmount = ogrp.getNearestStops(500, 59.935348, 30.325524).length;
      assert.notEqual(stopsAmount, 0);
      done();
    });
  });

  describe('Forecast method', () => {
    it('should get forecast by 0 stop id', (done) => {
      ogrp.getForecastByStopId(0, (err, response) => {
        assert.equal(err, null);
        assert.equal(response.result.length, 0);
        done();
      });
    });

    it('should get forecast by 1357 stop id', (done) => {
      ogrp.getForecastByStopId(1357, (err, response) => {
        assert.equal(err, null);
        assert.notEqual(response.result.length, 0);
        done();
      });
    });

    it('should not get forecast', (done) => {
      ogrp.getForecastByStopId('lol', (err, response) => {
        assert.notEqual(err, null);
        done();
      });
    });
  });
});
