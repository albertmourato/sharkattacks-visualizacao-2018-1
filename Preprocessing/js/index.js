var histograms = [];

var histWidth = 280;
var histHeight = 380;

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


async function getLocationCoordinates(city, area, country){
    var address = city+", "+area+", "+country;
    await geocoder.geocode({'address': address}, (results, status)=>{
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

    fatalHist = new Histogram(containerFatalHist, 0, 0, histWidth, histHeight,
        "Fatal attacks", dictToList('fatal'));

    sexHist = new Histogram(containerSexHist, 0, 0, histWidth, histHeight,
        "Attacks by sex", dictToList('sex'));

    histograms.push(fatalHist);
    histograms.push(sexHist);
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
    return data.reduce(function (r, a) {
        r[a[field]] = r[a[field]] || [];
        r[a[field]].push(a);
        return r;
    }, Object.create(null));
}

function getCountryIncidentsValue(country){
    var x = groupBy('country', a);
    var aux = x[country.toUpperCase()];

    return aux != undefined? aux.length : "None";
}

var dictToList = function(column){
    var dict = groupBy(column, a);
    var list = [];
    for(var key in dict){
        if(key !== "undefined") list.push([key, dict[key].length]);
    }
    return list;
}

var dictToListByCountry = function(column, country){
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