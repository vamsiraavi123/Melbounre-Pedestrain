	
	
	
	
	var map = L.map('map',{ center: [-37.808,144.959], zoom: 14 });
	var LightIcon = L.icon({
				iconUrl:'images/Light.svg',
				iconSize: [80,80]
			});
var MediumIcon = L.icon({
				iconUrl:'images/Moderate.svg',
				iconSize: [80,80]
			});
var HeavyIcon = L.icon({
				iconUrl:'images/Heavy.svg',
				iconSize: [80,80]
			});
var UndefinedIcon = L.icon({
				iconUrl:'images/Undefined.svg',
				iconSize: [80,80]
			});

  
	var pedstrainId=null;
	var hourlyCounts=null;
	var densityStatus=null;
	
	var mark;
	var popup=new L.popup();
	var placeLayer = L.layerGroup();
	
	var pastHourlyCounts=new Array();	
	
	var pedestrainData;
var pedestrainPastData;
function roundToHour(date) {
  p = 60 * 60 * 1000; // milliseconds in an hour
  return new Date(Math.round(date.getTime() / p ) * p);
}
var event = new Date();
var hours= event.getHours().toString();
console.log(hours);
var sam=roundToHour(event);
var hoursOne= sam.getHours().toString();
var hoursTwo=sam.getHours();
var day=sam.getDate();
sam=sam.toISOString();
var dayOne=sam.substring(0,8)+day+"T"+hoursOne+sam.substring(13);
var dayTwo=new Array();
var dayThree=new Array();
dayOne=dayOne.replace("2019","2018");
dayOne=dayOne.replace("Z","");
dayTwo.push("'"+dayOne+"'");
dayThree.push(sam.substring(0,8)+day+" at "+hoursTwo+":00");
for(i=0;i<23;i++){
if(hoursTwo!==0)
{
	hoursTwo=hoursTwo-1;
}else {
	day=day-1;
	hoursTwo=23;
}
dtwo="'"+sam.substring(0,8)+day+"T"+hoursTwo+sam.substring(13)+"'";
dayThree.push(sam.substring(0,8)+day+" at "+hoursTwo+":00");
console.log(dayThree);
dtwo=dtwo.replace("2019","2018");
dtwo=dtwo.replace("Z","");
dayTwo.push(dtwo);
}
DayT=dayTwo.toString();
	function currnetHours(currentHours){
		if(currentHours>=0 && currentHours<3)
		{
			return 0;
		} else if(currentHours>=3 && currentHours<6)
		{
			return 1;
		} else if(currentHours>=6 && currentHours<9)
		{
			return 2;
		} else if(currentHours>=9 && currentHours<12)
		{
			return 3;
		} else if(currentHours>=12 && currentHours<15)
		{
			return 4;
		} else if(currentHours>=15 && currentHours<18)
		{
			return 5;
		} else if(currentHours>=18 && currentHours<21)
		{
			return 6;
		} else 
		{
		return 7;
		}
	}
	var currentDate;
	var currentHours;
	var currentHourCount;
	var todayDate = new Date().toISOString().slice(0,10);
	currentDate=todayDate.replace('2019','2018');
	currentHours=new Date().getHours();
	currentHourCount=currnetHours(currentHours);
    var key="c3770c75e90e4c81b2d84600191210";
	var url = "https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=";
	var condition= "&q=Melbourne&format=json&+date="+currentDate;
	var Api_url=url+key+condition;
	var temperatureC=null;
	var weatherDescription=null;
	var weatherDescription=new Array();
	var tempData=new Array();
	$.ajax({
    url: Api_url,
    type: "GET"
}).done(function(data) {
	console.log(data.data);
console.log(data.data.weather[0].hourly[currentHourCount].tempC);
temperatureC=data.data.weather[0].hourly[currentHourCount].tempC;
weatherDescription=data.data.weather[0].hourly[currentHourCount].weatherDesc[0].value;
//tempData=data.data.weather[0].hourly.tempC;
//console.log(tempData);
console.log(weatherDescription);
$.ajax({
    url: "https://data.melbourne.vic.gov.au/resource/b2ak-trbp.json?date_time="+dayOne,
    type: "GET",
    data: {
      "$limit" : 100,
      "$$app_token" : "xy4krTqRfkljGARkVeKyGE836"
    }
}).done(function(data) {
  console.log(data);
  pedestrainData=data;
  $.ajax({
    url: "https://data.melbourne.vic.gov.au/resource/b2ak-trbp.json?$where=date_time in("+DayT+")",
    type: "GET",
    data: {
      "$limit" : 1500,
      "$$app_token" : "xy4krTqRfkljGARkVeKyGE836"
    }
}).done(function(data) {
  console.log(data);
  pedestrainPastData=data;
  
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiMTAxOTE1MzQxIiwiYSI6ImNqenJ0M3kyejE0amczZHAzb2szOXhxZWgifQ.pQeHGTDZC34I5iYu6ybzNg', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiMTAxOTE1MzQxIiwiYSI6ImNqenJ0M3kyejE0amczZHAzb2szOXhxZWgifQ.pQeHGTDZC34I5iYu6ybzNg'
    }).addTo(map);
	$.getJSON("https://cdn.jsdelivr.net/gh/vamsiraavi123/Melbounre-Pedestrain@master/features.geojson",function(data){
			// set coffeeShops to GeoJSON, add GeoJSON layer to the map once the file is loaded
			violationPoints = L.geoJson(data,{
				onEachFeature: function (feature, layer) {
					
					for(i=0;i<pedestrainData.length;i++){
					
						if(pedestrainData[i].sensor_id==feature.properties.sensor_id){
							pedstrainId=i;
							hourlyCounts=pedestrainData[pedstrainId].hourly_counts;
							console.log(hourlyCounts);
							feature.properties.status=null;
							if(hourlyCounts>0 && hourlyCounts<=500){
							densityStatus="Light";
							console.log(densityStatus);
							}else if(hourlyCounts>500 && hourlyCounts<=1500){
							densityStatus="Moderate";
							console.log(densityStatus);
							}else if(hourlyCounts>1500){
							densityStatus="Heavy";
							console.log(densityStatus);
							}else{
								densityStatus="Undefined";
								console.log(densityStatus);
							}
							feature.properties.status=densityStatus;
							}
							
						}
						for (i=0;i<pedestrainPastData.length;i++)
						{
							if(pedestrainPastData[i].sensor_id==feature.properties.sensor_id){
							pastHourlyCounts.push(pedestrainPastData[i].hourly_counts.toString());
							}
						}
						console.log(pastHourlyCounts);
						
						popup=layer.getPopup();		
						var popupContentOne='<div><table class="vitamins"><thead><tr><th>Pedstrain Count Information for:</th><th>'+feature.properties.name+'</th></tr></thead> </br> <tr><td>Density:</td> <td>' +feature.properties.status+ '</td></tr></br> <tr><td>Hourly Counts:</td><td>' +hourlyCounts+ '</br>At '+hours+':00 o clock</td></tr></br> <tr><td>Weather:</td> <td>' +temperatureC+ ' C </br>'+weatherDescription+'</td></tr></table><br>';
						//var popupContentTwo='<div class="app"> <h1>Last 6 hrs</h1> <ul class="hs"> <li class="item"><label>Hourly Counts:</label>'+pastHourlyCounts[0]+'<label>Weather Condition:</label></tr><tr>'+temperatureC+'</li> <li class="item"><label>Hourly Counts:</label>'+pastHourlyCounts[1]+'</br><label>Weather Condition:</label>'+temperatureC+'</li> <li class="item"><label>Hourly Counts:</label>'+pastHourlyCounts[2]+'</br><label>Weather Condition:</label>'+temperatureC+'</li><li class="item"><label>Hourly Counts:</label>'+pastHourlyCounts[3]+'</br><label>Weather Condition:</label>'+temperatureC+'</li><li class="item"><label>Hourly Counts:</label>'+pastHourlyCounts[4]+'</br><label>Weather Condition:</label>'+temperatureC+'</li><li class="item"><label>Hourly Counts:</label>'+pastHourlyCounts[5]+'</br><label>Weather Condition:</label>'+temperatureC+'</li></ul></div>';
						//var popupContentTwo='<div class="app"><h1>Last 6 hrs</h1> <ul class="hs"> <tr><td><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[0]+'</h3><h3><label>Weather Condition:</label></tr><tr>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[22]+'</h3></li> <li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[1]+'</h3></br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[21]+'</h3></li> <li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[2]+'</h3></br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[20]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[3]+'</h3></br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[19]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[4]+'<h3></br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[18]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[5]+'</h3></br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[17]+'</h3></li></ul></div>';
						// version 1 var popupContentTwo='<div class="app"><h1>Last 6 hrs</h1><ul class="hs"><tr><td><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[0]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[23]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[1]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[22]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[2]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[21]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[3]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[20]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[4]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[19]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[5]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[18]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[6]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[17]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[7]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[16]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[8]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[15]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[9]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[14]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[10]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[13]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[11]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[12]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[12]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[11]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[13]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[10]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[14]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[9]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[15]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[8]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[16]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[7]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[17]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[6]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[18]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[5]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[19]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[4]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[20]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[3]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[21]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[2]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[22]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[1]+'</h3></li><li class="item"><h3><label>Hourly Counts:</label>'+pastHourlyCounts[23]+'</h3><br><h3><label>Weather Condition:</label>'+temperatureC+'</h3><br><h3><label>Time&Date:</label><br>'+dayThree[0]+'</h3></li></ul></div>';
						var popupContentTwo='<div class="app"><h1>Last 24 hrs</h1><ul class="hs"><tr><td><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[0]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[23]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[1]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[22]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[2]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[21]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[3]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[20]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[4]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[19]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[5]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[18]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[6]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[17]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[7]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[16]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[8]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[15]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[9]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[14]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[10]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[13]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[11]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[12]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[12]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[11]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[13]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[10]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[14]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[9]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[15]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[8]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[16]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[7]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[17]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[6]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[18]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[5]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[19]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[4]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[20]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[3]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[21]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[2]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[22]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[1]+'</h3></li><li class="item"><h3>Hourly Counts:'+pastHourlyCounts[23]+'</h3><br><h3>Weather Condition:'+temperatureC+'</h3><br><h3>Time&Date:<br>'+dayThree[0]+'</h3></li></ul></div>';
						//var popupContentTwo='<article class="widget"><div class="weatherIcon">'+pastHourlyCounts[0]+'</div><div class="weatherInfo"><div class="temperature"><span>'+temperatureC+'&deg;</span></div><div class="description"><div class="weatherCondition">'+weatherDescription+'</div><div class="place">'+feature.properties.name+'</div></div></div><div class="date">'+todayDate+'</div></article></div></div>';
						popup=layer.bindPopup(popupContentOne+popupContentTwo,{maxWidth: 300}).getPopup();
						pastHourlyCounts=[];


}, pointToLayer: function (feature, latlng) {
	if (densityStatus == "Light"){
						
						mark = L.marker(latlng,	{icon: LightIcon});
					console.log("lightIcon");
					} else if (densityStatus== "Moderate"){
						
						mark = L.marker(latlng,{icon: MediumIcon});
					console.log("MediumIcon");
					} else if (densityStatus== "Heavy"){
						
						mark = L.marker(latlng,{icon: HeavyIcon});
					console.log("HeavyIcon");
					} else {
						mark = L.marker(latlng,{icon: UndefinedIcon});
					}
					//console.log(mark);
					return mark;
			}
		        
			})	.addTo(map);
		});

});
});

});

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
			div.innerHTML += '<br /><img src="images/Light1.svg">Light (<=500)';
			div.innerHTML += '<br /><img src="images/Moderate1.svg">Moderate (>500 & <=1500)';
			div.innerHTML += '<br /><img src="images/Heavy1.svg">Heavy(>=1500)';

			// Return the Legend div containing the HTML content
			return div;
		};

		// Add Legend to Map
		legend.addTo(map);

		// Add Scale Bar to Map
		L.control.scale({position: 'bottomleft'}).addTo(map);
