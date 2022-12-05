    // Initialize the platform object
    var platform = new H.service.Platform({
        'apikey': 'rfQfGRM_anU-mHLjd1Yv5oUgbmB_d41KAgjT9pvHqgAnUGVakr-f9qTlZvnkWIXVe7CfMYCvF7wUphLNVgonaw'
      });
  
      // Obtain the default map types from the platform object
      var defaultLayers = platform.createDefaultLayers();
  
      // Instantiate (and display) the map
      var map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
          zoom: 7.9,
          center: { lng: 13.4, lat: 52.5 }
        });

// Create the parameters for the routing request:
var routingParameters = {
    'routingMode': 'fast',
    'transportMode': 'car',
    // The start point of the route:
    'origin': '50.1120423728813,8.68340740740811',
    // The end point of the route:
    'destination': '52.5309916298853,13.3846220493377',
    // Include the route shape in the response
    'return': 'polyline'
  };
  
  // Define a callback function to process the routing response:
  var onResult = function(result) {
    // ensure that at least one route was found
    if (result.routes.length) {
      result.routes[0].sections.forEach((section) => {
           // Create a linestring to use as a point source for the route line
          let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
  
          // Create a polyline to display the route:
          let routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineWidth: 3 }
          });
  
          // Create a marker for the start point:
          let startMarker = new H.map.Marker(section.departure.place.location);
  
          // Create a marker for the end point:
          let endMarker = new H.map.Marker(section.arrival.place.location);
  
          // Add the route polyline and the two markers to the map:
          map.addObjects([routeLine, startMarker, endMarker]);
  
          // Set the map's viewport to make the whole route visible:
          map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
      });
    }
  };
  
  // Get an instance of the routing service version 8:
  var router = platform.getRoutingService(null, 8);
  
  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });

  //Within the onResult callback:

// Create an outline for the route polyline:
var routeOutline = new H.map.Polyline(linestring, {
    style: {
      lineWidth: 10,
      strokeColor: 'rgba(0, 128, 255, 0.7)',
      lineTailCap: 'arrow-tail',
      lineHeadCap: 'arrow-head'
    }
  });
  // Create a patterned polyline:
  var routeArrows = new H.map.Polyline(linestring, {
    style: {
      lineWidth: 10,
      fillColor: 'white',
      strokeColor: 'rgba(255, 255, 255, 1)',
      lineDash: [0, 2],
      lineTailCap: 'arrow-tail',
      lineHeadCap: 'arrow-head' }
    }
  );
  // create a group that represents the route line and contains
  // outline and the pattern
  var routeLine = new H.map.Group();
  routeLine.addObjects([routeOutline, routeArrows]);