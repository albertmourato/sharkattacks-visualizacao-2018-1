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
    console.log(a)
}