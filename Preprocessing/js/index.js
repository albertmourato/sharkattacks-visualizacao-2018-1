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


function saveCoordinates(city, area, country){
    var coordinate = getLocationCoordinates(city, area, country);
    coordinates.push(coordinate);
}


function loadAllCoordinates(addresses){
    addresses.forEach(address => {
        getLocationCoordinates(address.city, address.area, address.country);
        sleep(30000);
    });
}

function groupBy(field, data){
    return data.reduce(function (r, a) {
        r[a[field]] = r[a[field]] || [];
        r[a[field]].push(a);
        return r;
    }, Object.create(null));
}