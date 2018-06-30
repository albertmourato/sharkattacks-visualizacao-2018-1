var myMap = L.map('myMap').setView([-10.24, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(myMap);

var countriesGroup = L.layerGroup().addTo(myMap);


function clearMap(){
    myMap.removeLayer(countriesGroup);
}

// Math.max.apply(Math,myData.map(function(o){return o.length;}))

// var colorScale = d3.scaleLinear().domain([0, 1366]).range(['#FFAFBA','#FF0400']);

stateGroup = L.layerGroup().addTo(myMap);

var geojson;

async function drawIncidentByState(){    
    d3.json('./data/countries.geojson', (error, data) => {
        geojson = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(stateGroup);
    });
}

drawIncidentByState();

function colorScale(numberOfAttack){
    if(numberOfAttack < 10) return "#FFE2E1"
    if(numberOfAttack < 20) return "#FFC5C4"
    if(numberOfAttack < 40) return "#FFAAA9"
    if(numberOfAttack < 70) return "#FF8987"
    if(numberOfAttack < 100) return "#FF6966"
    if(numberOfAttack < 500) return "#FF3D3A"
    if(numberOfAttack < 1000) return "#FF0400"
    if(numberOfAttack < 1500) return "#C80300"
    return "#7C0200"   
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#000',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function style(feature) {
    var x = groupBy('country', a);
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

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}