var histograms = [];
var dornutCharts = [];
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

    fatalHist = new Histogram(containerFatalHist, 30, 0, histWidth - 50, histHeight - 50,
        "Fatal attacks", dictToList('fatal'));

    sexHist = new Histogram(containerSexHist, 30, 0, histWidth - 50, histHeight - 50,
        "Attacks by sex", dictToList('sex'));

    typeHist = new Histogram(containerTypeHist, 30, 0, typeWidth - 50, histHeight - 50,
        "Attacks by type", dictToList('type'));

    histograms.push(fatalHist);
    histograms.push(sexHist);
    histograms.push(typeHist);
    
    dornutChart(dictToList2('fatal') , '#fatalDornut' );
    dornutChart(dictToList2('sex') , '#sexDornut');
    dornutChart(dictToList2('type'), '#typeDornut');

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


var dornutChart =  function(dataset, dv) {
    'use strict';
    var tooltip = d3.select(dv)            
    .append('div')                             
    .attr('class', 'tooltip');                 

    tooltip.append('div')                        
    .attr('class', 'label');                   

    tooltip.append('div')                        
    .attr('class', 'count');                   

    tooltip.append('div')                        
    .attr('class', 'percent');                 

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(["#660000","#990000","#CC0000","#FF0000","#CC3333",
    "#FF6666","#FF9999","#FFCCCC"]);

    var svg = d3.select(dv)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + 
        ',' + (height / 2) + ')');
    
    var donutWidth = 75;

    var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

    var pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);

    var legendRectSize = 18;
            var legendSpacing = 4;
    
    var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) { 
        return color(d.data.type);
    
    });
    
    var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset =  height * color.domain().length / 2;
    var horz = -2 * legendRectSize;
    var vert = i * height - offset;
    return 'translate(' + horz + ',' + vert + ')';
    });
        
    legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);
        
    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

}
  