var map = L.map('map',{ center: [-37.808,144.959], zoom: 14 });

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiMTAxOTE1MzQxIiwiYSI6ImNqenJ0M3kyejE0amczZHAzb2szOXhxZWgifQ.pQeHGTDZC34I5iYu6ybzNg', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiMTAxOTE1MzQxIiwiYSI6ImNqenJ0M3kyejE0amczZHAzb2szOXhxZWgifQ.pQeHGTDZC34I5iYu6ybzNg'
    }).addTo(map);

		// Add Rodent Violation GeoJSON Data
		// Null variable that will hold rodent violation data
		var violationPoints = null;

		// Get GeoJSON and put on it on the map when it loads
		$.getJSON("https://cdn.jsdelivr.net/gh/vamsiraavi123/Melbounre-Pedestrain@master/Pedestrain_Count%20(2).geojson",function(data){
			// set coffeeShops to GeoJSON, add GeoJSON layer to the map once the file is loaded
			violationPoints = L.geoJson(data,{
				onEachFeature: function (feature, layer) {
					layer.bindPopup(feature.properties.name+ '</br>' +feature.properties.sensor_id+ '</br>'+ feature.properties.sensor_id) ;
				}, pointToLayer: function (feature, latlng) {
					if (feature.properties.status == "Light"){
					var marker = L.marker(latlng,	{icon: LightIcon});
					} else if (feature.properties.status == "Moderate"){
					var marker = L.marker(latlng,{icon: MediumIcon});
					} else {
					var marker = L.marker(latlng,{icon: HeavyIcon});
					}
					return marker;
		        }
			}).addTo(map);
		});

		// Create Custom Icons Here
		// Icon Class
		var RodentIcon = L.Icon.extend({
			options:{
				iconSize: [80,80],
				shadowSize: [36,36],
				iconAnchor: [18,18],
				shadowAnchor: [18,18],
				popupAnchor: [0,-6]
			}
		});

		// Create specific icons
		var LightIcon = new RodentIcon({iconUrl: 'images/Light.svg'});
		var MediumIcon = new RodentIcon({iconUrl: 'images/Moderate.svg'});
		var HeavyIcon = new RodentIcon({iconUrl: 'images/Heavy.svg'});


				// Set function for color ramp
		function setColor(density){
			return density > 85 ? '#a50f15' :
			       density > 15 ? '#de2d26' :
			       density > 8 ? '#fb6a4a' :
			       density > 4 ? '#fcae91' :
			                     '#fee5d9';
		};

		// Set style function that sets fill color property equal to rodent density
		function style(feature) {
		    return {
		        fillColor: setColor(feature.properties.rodentDensity),
		        fillOpacity: 0.7,
		        weight: 2,
		        opacity: 1,
		        color: '#ffffff',
		        dashArray: '3' 
			};
		}

		// Create Leaflet Control Object for Legend
		var legend = L.control({position: 'topright'});

		// Function that runs when legend is added to map
		legend.onAdd = function (map) {

			// Create Div Element and Populate it with HTML
			var div = L.DomUtil.create('div', 'legend');		    
			div.innerHTML += '<b>Pedestrain count Density</b><br />';
			div.innerHTML += 'by Location<br />';
			div.innerHTML += '<small>Pedestrains/Hour</small><br />';  
			div.innerHTML += '<br /><img src="images/Light1.svg">Light';
			div.innerHTML += '<br /><img src="images/Moderate1.svg">Moderate';
			div.innerHTML += '<br /><img src="images/Heavy1.svg">Heavy';

			// Return the Legend div containing the HTML content
			return div;
		};

		// Add Legend to Map
		legend.addTo(map);

		// Add Scale Bar to Map
		L.control.scale({position: 'bottomleft'}).addTo(map);
