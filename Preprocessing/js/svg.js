var filterChecked = false;
var year = 2018;
function updateWorld(yearr, value){
    filterChecked = value;
    if(value){
        year = yearr;
        clearMap();
        stateGroup = L.layerGroup().addTo(myMap);
        var incidents = getIncidentsByYear(year);
    }
    drawIncidentByState();
}

function isFilterChecked(){
    return filterChecked;
}

function getYear(){
    return year;
}