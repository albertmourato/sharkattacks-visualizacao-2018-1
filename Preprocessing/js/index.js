var histWidth = 230;
var histHeight = 420;

var containerFatalHist = d3.select("#fatalhist")
    .append("svg")
    .attr("width", histWidth)
    .attr("height", histHeight);
var fatalHist = {};

var containerSexHist = d3.select("#sexhist")
    .append("svg")
    .attr("width", histWidth)
    .attr("height", histHeight);
var sexHist = {};

var typeWidth = 500;

var containerTypeHist = d3.select("#typehist")
    .append("svg")
    .attr("width", typeWidth)
    .attr("height", histHeight);
var typeHist = {};

var areaWidth = 480;

var containerAreaHist = d3.select("#areahist")
    .append("svg")
    .attr("width", areaWidth)
    .attr("height", histHeight);
var areaHist = {};

var yearWidth = window.innerWidth - 10;
var yearHeight = 200;

var containerYearHist = d3.select("#yearhist")
    .append("svg")
    .attr("width", yearWidth)
    .attr("height", yearHeight);
var yearHist = {};

function getLocationCoordinates(city, area, country){
    var address = city+", "+area+", "+country;
    geocoder.geocode({'address': address}, (results, status)=>{
        if(status == google.maps.GeocoderStatus.OK){
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            console.log('lat: '+lat+' lng: '+lng)
            return ({"lat": lat, "lng": lng});
        }else{
            console.log("Something went wrong "+status);
        }
    });
}

d3.csv("./data/attacks.csv", (data => {
    var dados = data.map(e => {
        return {
            activity: e["Activity"],
            age: e["Age"],
            area: e["Area"],
            city: e["Location"],
            country: e["Country"],
            date: e["Date"],
            fatal: e["Fatal (Y/N)"],
            type: e["Type"],
            year: e["Year"],
            sex: e["Sex "]
        }
    });
    filterByValidKeys(dados);

    yearHist = new YearHistogram(containerYearHist, 30, 0, yearWidth - 50, yearHeight - 50,
        "Attacks by year", dictToList('year').filter(d => d[0] >= 1900));

    typeHist = new Histogram(containerTypeHist, 30, 0, typeWidth - 50, histHeight - 50,
        "Attacks by type", dictToList('type'));

    areaHist = new Histogram(containerAreaHist, 0, 0, areaWidth - 50, histHeight - 50,
        "Attacks by area", attacksByArea('all'));
    
    donutChart(dictToList('fatal') , '#fatalDonut', "Fattal attacks");
    donutChart(dictToList('sex') , '#sexDonut', "Attacks by gender");

}));
 
var a = [{}];
var invalid = 'none None "" unknown';
 
// var keys = ["activity", "age", "area", "city", "country", "date", "fatal", "type", "year", "sex"];
var keys = ["country"];

var processedData;

function filterByValidKeys(data){
    data.forEach(e => {
        var aux = 0;
        for(var i = 0 ; i < keys.length ; i++){
            if(e[keys[i]] == ""){
                aux++;
                if(aux>0) break;
            }
        }
        if(aux<=0)a.push(e);
    });
    // console.log(a)
}


var coordinates = [{}];
var geocoder = new google.maps.Geocoder();


function groupBy(field, data){
    if(data == undefined){
        alert('No data is available');
        return;
    }
    return data.reduce(function (r, a) {
        r[a[field]] = r[a[field]] || [];
        r[a[field]].push(a);
        return r;
    }, Object.create(null));
}

function countIncidentsByCountry(country){
    var x = groupBy('country', a);
    var aux = x[country.toUpperCase()];

    return aux != undefined? aux.length : "None";
}

function dictToList(column){
    var dict = groupBy(column, a);
    var list = [];
    for(var key in dict){
        if(key !== "undefined") list.push([key, dict[key].length]);
    }
    return list;
}

var dictToList2 = function(column){
    var dict = groupBy(column, a);
    var list = [];
    for(var key in dict){
        var temp = { type: key, value: dict[key].length  }; 
        if(key == "") temp = { type: "Unknown", value: dict[key].length  }; 
        
        if(key != "undefined") list.push(temp);
    }

    return list;
}

function dictToListByCountry(column, country){
    var totalDict = groupBy(column, a);
    var dict = groupBy(column, groupBy('country', a)[country.toUpperCase()]);
    var list = [];
    for(var key in totalDict){
        if(key !== "undefined"){
            dict[key] ? list.push([key, dict[key].length]) : list.push([key, 0]);
        }
    }
    return list;
}

function dictToListByCountrySubData(column, country, data){
    var totalDict = groupBy(column, a);
    var dict = groupBy(column, groupBy('country', data)[country.toUpperCase()]);
    var list = [];
    for(var key in totalDict){
        if(key !== "undefined"){
            dict[key] ? list.push([key, dict[key].length]) : list.push([key, 0]);
        }
    }
    return list;
}

function dictToListByYear(data, column, year){
    var totalDict = groupBy(column, a);
    var dict = groupBy(column, groupBy('year', data)[year]);
    var list = [];
    for(var key in totalDict){
        if(key !== "undefined"){
            dict[key] ? list.push([key, dict[key].length]) : list.push([key, 0]);
        }
    }
    return list;
}

var dictToListByCountry2 = function(column, country){
    var totalDict = groupBy(column, a);
    var dict = groupBy(column, groupBy('country', a)[country.toUpperCase()]);
    var list = [];
    
    for(var key in totalDict){
        var temp = {type: key, value: dict[key].length }
        if(key == "") temp = { type: "Unknown", value: dict[key].length  }; 

        if(key !== "undefined"){
            dict[key] ? list.push(temp) : list.push({type: key, value: 0});
        }
    }
    return list;
}
  
function attacksByArea(country){
    var dict = (country === 'all') ? dictToList('area', a) : dictToListByCountry('area', country);
    dict = dict.filter(d => d[1] !== 0)
                .sort((a, b) => b[1] - a[1]);
    return (dict.length <= 5) ? dict : dict.slice(0, 5);
}

function attacksByAreaSubData(country, data){
    var dict = (country === 'all') ? dictToList('area', data) : dictToListByCountrySubData('area', country, data);
    dict = dict.filter(d => d[1] !== 0)
                .sort((a, b) => b[1] - a[1]);
    return (dict.length <= 5) ? dict : dict.slice(0, 5);
}

function attacksByArea2(country){
    var dict = (country === 'all') ? dictToList2('area', a) : dictToListByCountry2('area', country);
    dict = dict.filter(d => d[1] !== 0)
                .sort((a, b) => b[1] - a[1]);
    return (dict.length <= 5) ? dict : dict.slice(0, 5);
}

function generateYearsArray(){
    var arr = [];
    for(var i = brushYearStart; i <= brushYearEnd; i++){
        arr.push(i);
    }
    return arr;
}

function countIncidentsByYear(year){
    var x = groupBy('year', a);
    var aux = x[year];
    return aux != undefined? aux.length : 0;
}

function getIncidentsByYear(year){
    var x = groupBy('year', a);
    return x[year];
}

function countIncidents(){
    return Object.keys(a).length;
}

function countIncidentsByCountryYear(country, year){
    var incidents = groupBy('year', a);
    var incidentsByYear = groupBy('country', incidents[year]);
    var country = incidentsByYear[country.toUpperCase()];
    return country != undefined ? country.length : 0;
}

function updateCharts(country, year, checked){
    var typeData, areaData, fatalData, genderData;
    
    if(checked){
        var incidents = groupBy('country', getIncidentsByYear(year));

        typeData = dictToListByCountrySubData('type', country, incidents[country]);
        areaData = attacksByAreaSubData(country, incidents[country]);
        fatalData = dictToListByCountrySubData('fatal', country, incidents[country]);
        genderData = dictToListByCountrySubData('sex', country, incidents[country]);
    } else {
        typeData = dictToListByCountry('type', country);
        areaData = attacksByArea(country);
        fatalData = dictToListByCountry('fatal', country);
        genderData = dictToListByCountry('sex', country);
    }

    d3.select("#typehist").select("svg").selectAll("*").remove();
    typeHist = new Histogram(containerTypeHist, 30, 0, typeWidth - 50, histHeight - 50,
        "Attacks by type", typeData);

    d3.select("#areahist").select("svg").selectAll("*").remove();
    areaHist = new Histogram(containerAreaHist, 30, 0, areaWidth - 50, histHeight - 50,
        "Attacks by area", areaData);

    d3.select("#fatalDonut").selectAll("*").remove();
    donutChart(fatalData , '#fatalDonut', "Fattal attacks");

    d3.select("#sexDonut").selectAll("*").remove();
    donutChart(genderData , '#sexDonut', "Attacks by gender");
}