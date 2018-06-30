var myMap = L.map('myMap').setView([-10.24, 0], 2);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(myMap);

var countriesGroup = L.layerGroup().addTo(myMap);


function clearMap(){
    myMap.removeLayer(countriesGroup);
}

// Math.max.apply(Math,myData.map(function(o){return o.length;}))

var colorScale = d3.scaleLinear().domain([0, 1366]).range(['#FFAFBA','#FF0400']);


function drawIncidentByState(){
    stateGroup = L.layerGroup().addTo(myMap);
    var x = groupBy('country', a);
    d3.json('./data/countries.geojson', (error, data) => {
        L.geoJSON(data, {
            style (feature, layer) {
                // console.log(feature.properties.ADMIN)
                var color;
                if(x[(feature.properties.ADMIN).toUpperCase()] != undefined){
                    colorScale(x[(feature.properties.ADMIN).toUpperCase()].length);
                    // console.log(x[(feature.properties.ADMIN).toUpperCase()].length);
                    color = colorScale(x[(feature.properties.ADMIN).toUpperCase()].length);
                }else{
                    color = "#A7A7A7";
                }

                return {
                    fillColor: color,
                    opacity: 1,
                    weight: 1,
                    color: "#FFF",
                    fillOpacity: 1
                }
            }
        }).addTo(stateGroup);
    });
}