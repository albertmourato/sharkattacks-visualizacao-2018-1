var margin = {top: 10, right: 10, bottom: 10, left: 20}
var width = 1000 - margin.left - margin.right;
var height = 100 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var myBrush = d3.brush();
var brushGroup = svg.append("g").attr("class", "x brush").attr("transform", "translate("+(margin.left+20)+", "+margin.top+")");
myBrush(brushGroup);

var xInterval = [0, 78462378]
var xScale = d3.scaleLinear().domain(xInterval).range([0, width - margin.left])
var mySvgXAxis = svg.append("g").attr("transform", "translate("+(margin.left+20)+", "+(height)+")");
var xAxis = d3.axisBottom(xScale);
mySvgXAxis.call(xAxis);

// var brush = d3.svg.brush()
//     .x(x2) 
//     .on("brush", brushed);