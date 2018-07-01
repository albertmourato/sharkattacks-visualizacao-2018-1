var histWidth = 380;
var histHeight = 380;
var container = d3.select("#fatalhist")
    .append("svg")
    .attr("width", histWidth)
    .attr("height", histHeight);

var renderingArea = {x: 30, y: 0, width: 250, height: 320};
var margins = {top: 50, right: 5, bottom: 20, left: 25};

var width = renderingArea.width - margins.right - margins.left;
var height = renderingArea.height - margins.top - margins.bottom;

var canvas = container.append("g")
    .attr("transform", "translate(" + (renderingArea.x + margins.left)
        + "," + (renderingArea.y + margins.top) + ")");

// var fatalData = dictToList(groupBy('fatal', a));
var fatalData = [["N", 4308], ["Y", 1417], ["", 445]];

var xScale = d3.scaleBand() 
    .domain(d3.range(fatalData.length))
    .range([0, this.width])
    .round(true)
    .paddingInner(0.15)
    .paddingOuter(0.1);

var xAxis = d3.axisBottom(xScale)
    .tickFormat(d => ((fatalData[d][0] === "") ? "Unknown" : fatalData[d][0]));

var dataYInterval = d3.extent(fatalData, d=> d[1]);
var yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, dataYInterval[1]]);
var yAxis = d3.axisLeft(yScale);

var xAxisGroup = canvas.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")"); 
xAxisGroup.call(xAxis);

var yAxisGroup = canvas.append("g")
    .attr("class", "yAxis");
yAxisGroup.call(yAxis);

var title = canvas.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margins.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Fatal attacks");

var bars = canvas.selectAll("rect").remove().exit().data(fatalData);

bars.enter()
    .merge(bars)
    .append("rect")
    .attr("x", (d, i) => this.xScale(i))
    .attr("y", d => this.yScale(d[1]))
    .attr("width", this.xScale.bandwidth())
    .attr("height", d => (this.yScale(0) - this.yScale(d[1])))
    .attr("fill", "#c10707");