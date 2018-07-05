var filterChecked = false;
var year = 2018;
var defaultValue = 1990;

function updateWorld(yearr, value){
    filterChecked = value;
    if(value){
        year = (yearr) ? yearr : defaultValue;
        clearMap();
        stateGroup = L.layerGroup().addTo(myMap);
        var incidents = getIncidentsByYear(year);
        
        d3.select("#yearLbl").text(year);
        updateChartsByYear(year, value);
    } else {
        d3.select("#yearLbl").text("");
    }

    d3.select('#countryLbl').text("");

    drawIncidentByState();
}

function isFilterChecked(){
    return filterChecked;
}

function getYear(){
    return year;
}