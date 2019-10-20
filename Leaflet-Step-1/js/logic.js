
// Define satellite View tile layer
var satelliteView = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Define street View tile layer 
var streetView = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.street",
  accessToken: API_KEY
});

// Initialize the Earthquake and Tectonic Plates layers
var layers = {
  tectonicplates: new L.LayerGroup(),
  earthquakes: new L.LayerGroup()  
};

var map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [
    layers.tectonicplates,
    layers.earthquakes
    ]
});

//Function to color circles based on the value of Magnitude
function getColor(mag) {
  return mag >= 5 ? "#EA2C2C" : 
  mag >= 4? "#EA822C" :
  mag >= 3? "#EE9C00" :
  mag > 2? "#EECC00" :
  mag > 1? "#D4EE00" :
  "#98EE00";
};

lightmap.addTo(map);

//Base Maps
var baseMaps = {
  "Satellite": satelliteView,
  "Grayscale": lightmap,
  "Outdoors": streetView 
};

//Overlay Maps
var overlays = {
  "Fault Lines": layers.tectonicplates,
  "Earthquakes": layers.earthquakes  
};

L.control.layers(baseMaps, overlays).addTo(map);

//Create a Legend for Map
var info = L.control({
  position: "bottomright"
});

info.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend'),   
    mags = [0,1,2,3,4,5];
    var legendColors = ["#98EE00", "#D4EE00", "#EECC00", "#EE9C00", "#EA822C", "#EA2C2C"];
    for (var i = 0; i < mags.length; i++) {
      div.innerHTML += "<i style='background: " + legendColors[i] + "'></i> " + mags[i] + (mags[i + 1] ? "&ndash;" + mags[i + 1] + "<br>" : "+");
    }
    return div;
};

info.addTo(map);

// d3.json("https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json",
//Need to use URL for raw data
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
  function(tectonicplatedata) { 
    L.geoJson(tectonicplatedata, {
      weight: 2,
      color: "orange"  
    }).addTo(layers.tectonicplates);
});

// Perform a GET request to the query URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  
  
  for (var i = 0; i < data.features.length; i++) {
    var location = data.features[i].properties.place
    var lat = data.features[i].geometry.coordinates[0];
    var lng = data.features[i].geometry.coordinates[1];
    var magnitude = data.features[i].properties.mag
    var earthQuakeTime = data.features[i].properties.time
    
    L.circle([lng,lat], {
          opacity: 1,
          weight: 0.5,
          fillColor: getColor(magnitude),
          fillOpacity: 1,
          color: "black",
          // This will make the marker size proportionate to the magnitude of earthquake
          radius: (magnitude * 12000)
        }).bindPopup("Magnitude: "+magnitude +"<br> Location: "+ location +"<br> Date: " + new Date(earthQuakeTime))
        .addTo(layers.earthquakes);
  }

});




  

