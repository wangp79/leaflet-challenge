var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


markerSize = []
locations = []
fillColors=''

d3.json(queryUrl).then(function(data) {
  console.log(data.features)

createFeatures(data.features);
});



function createCircleMarker(feature, latlng ){
  fillColors=''
if (feature.properties.mag> 5) {
  fillColors = "red";
}
else if (feature.properties.mag > 4) {
  fillColors = "orange";
}
else if (feature.properties.mag> 3) {
  fillColors = "yellow";
}
else if (feature.properties.mag> 2){
  fillColors = 'lightgreen'
}
else if (feature.properties.mag> 1){
  fillColors = "green";
}
else {
  fillColors = 'white'
}
 options = {
    radius: feature.properties.mag*5,
    fillColor : fillColors,
    color: "white",
    weight: 1,
    opacity: 1,
    fillOpacity: 3
  }
  return L.circleMarker( latlng, options );

}


function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 'magnitude is '+feature.properties.mag+"</p>");
  }


  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}




function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });


  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
}
