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
    filterByValidKeys(dados)
    // console.log(dados)
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