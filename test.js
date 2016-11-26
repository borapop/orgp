let Orgp = require('./index');
let orgp;
let assert = require('assert');
describe('Orgp class', function() {
  before((done) => {
    orgp = new Orgp('../transport-telegram-bot/gtfs/', () => {
      done();
    });
  });

  describe('Routes methods', () => {
    it('should get all routes', (done) => {
      assert.notEqual(orgp.getRoutes(), null);
      done();
    });

    it('should get route by id', (done) => {
      assert.equal(orgp.getRouteById(1), null);
      assert.notEqual(orgp.getRouteById(3260), null);
      done();
    });

    it('should get route by query', (done) => {
      assert.notEqual(orgp.getRoutesByQuery('12345678'), null);
      assert.notEqual(orgp.getRoutesByQuery('50'), null);
      orgp.getRoutesByQuery('181');
      done();
    });
  });

  describe('Stops methods', () => {
    it('should get all stops', (done) => {
      assert.notEqual(orgp.getStops(), null);
      done();
    });

    it('should get stop in radius (meters)', (done) => {
      assert.notEqual(orgp.getNearestStops('1', '1', '3'), null);
      assert.notEqual(orgp.getNearestStops(1, 59.935348, 30.325524), null);
      let stopsAmount = orgp.getNearestStops(500, 59.935348, 30.325524).length;
      assert.notEqual(stopsAmount, 0);
      done();
    });
  });

  describe('Forecast method', () => {
    it('should get forecast by 0 stop id', (done) => {
      orgp.getForecastByStopId(0, (err, response) => {
        assert.equal(err, null);
        assert.equal(response.result.length, 0);
        done();
      });
    });

    it('should get forecast by 1357 stop id', (done) => {
      orgp.getForecastByStopId(1357, (err, response) => {
        assert.equal(err, null);
        assert.notEqual(response.result.length, 0);
        done();
      });
    });

    it('should not get forecast', (done) => {
      orgp.getForecastByStopId('lol', (err, response) => {
        assert.notEqual(err, null);
        done();
      });
    });
  });
});
