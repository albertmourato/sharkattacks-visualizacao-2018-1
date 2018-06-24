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
    cleanData(dados)
    // console.log(dados)
}));
 
var a = [{}];
var invalid = 'none None "" unknown';
 
var keys = ["activity", "age", "area", "city", "country", "date", "fatal", "type", "year", "sex"];

var processedData;

function cleanData(data){
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
function getCoordinates(city, area, country){
    var address = city+", "+area+", "+country;
    await geocoder.geocode({'address': address}, (results, status)=>{
        if(status == google.maps.GeocoderStatus.OK){
            var lat = results[0].geometry.location.lat();
            var lgn = results[0].geometry.location.lng();
            coordinates.push({"lat": lat, "lng": lgn});
            console.log('lat: '+lat+' lng: '+lng)
            return [lat, lgn];
        }else{
            console.log("Something went wrong "+status);
        }
    });
}


function loadAllCoordinates(addresses){
    addresses.forEach(address => {
        getCoordinates(address.city, address.area, address.country);
    });
    // return addresses.map(address => { return getCoordinates(address.city, address.area, address.country); });
}

var coordinatesAux = loadAllCoordinates(a);

console.log(coordinatesAux);