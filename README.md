# orgp
API to obtain data from [transport.orgp.spb.ru](transport.orgp.spb.ru).

## Installation
`npm i orgp`

Download and unzip feed.zip from [http://transport.orgp.spb.ru/Portal/transport/internalapi/gtfs/feed.zip](http://transport.orgp.spb.ru/Portal/transport/internalapi/gtfs/feed.zip)

## Usage
`let Orgp = require('orgp');`  
`let orgp = new Orgp('/path/to/your/feed', () => {`  
`let routes = orgp.getRoutes();`    
`console.log(routes);`    
`}`

## Tests  
`npm i -g mocha`  
`mocha test.js`  

 If you get the timeout exceeded error try  
 
`mocha --timeout 5000 test.js`


##Methods
* `orgp.getRoutes()`

 Returns all routes from GTFS feed

* `orgp.getRouteById(id)`

 Returns route with passed `id`. If route not found returns `null`.

* `orgp.getRoutesByQuery(query)`

 Returns array of routes with `short_name` that matches `query`.
 Returns `[]` if nothing matches `query`.

* `orgp.getStops()`

 Returns all stops from GTFS feed

* `orgp.getStopById()`

 Returns stop with passed `id`. If stop not found returns `null`.

* `orgp.getNearestStops(radius, lattitude, longitude),`

 Returns array of all stops with distance to passed location (`lattitude`, `longitude`) less than `radius`

* `orgp.getForecastByStopId(id, (err, result) => {`  
` if(err) return;`  
` console.log(result);`  
`})`  

 Returns JSON answer from transport.orgp.spb.ru with transport forecast for stop with `id`.





Read about General Transit Feed Specification at [https://developers.google.com/transit/gtfs/](https://developers.google.com/transit/gtfs/)
