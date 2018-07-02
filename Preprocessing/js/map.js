var myMap = L.map('myMap').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(myMap);
var countriesGroup = L.layerGroup().addTo(myMap);


function clearMap(){
    myMap.removeLayer(countriesGroup);
}

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
        weight: 2,
        color: '#283747',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function style(feature) {
    var x = groupBy('country', a);
    var color;
    if(x[(feature.properties.ADMIN).toUpperCase()] != undefined){
        colorScale(x[(feature.properties.ADMIN).toUpperCase()].length);
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
        click: countryInfo
    });
}

function countryInfo(e){
    var layer = e.target;
    var country = layer.feature.properties.ADMIN.toUpperCase();

    fatalHist.setData(dictToListByCountry('fatal', country));
    sexHist.setData(dictToListByCountry('sex', country));
    typeHist.setData(dictToListByCountry('type', country));
}

// TOP RIGHT INFO

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>World\'s Shark Attacks</h4>' +  (props?
        '<b>' + getCountryIncidentsValue(props.ADMIN) + '</b><br />' + props.ADMIN
        : 'Hover over a country');
};

info.addTo(myMap);

// BOTTOM RIGHT LEGEND

var legend = L.control({position: 'bottomright'});



legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 40, 70, 100, 500, 1000, 1500],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorScale(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);