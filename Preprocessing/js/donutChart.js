var donutChart =  function(dataset, dv, chartTitle) {
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

    var totalWidth = 350;
    var totalHeight = 350;

    var margins = {top: 150, right: 50, bottom: 100, left: 50};
    var width = totalWidth - margins.right - margins.left;
    var height = totalHeight - margins.top - margins.bottom;

    //var radius = Math.min(totalWidth, totalHeight) / 2;
    var radius = 150;
    
    var color = d3.scaleOrdinal(["#436eba","#ea4d5a","#dee0e2"]);

    // var color = d3.scaleOrdinal(["#660000","#990000","#CC0000","#FF0000","#CC3333",
    // "#FF6666","#FF9999","#FFCCCC"]);

    var svg = d3.select(dv)
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight)
    .append('g')
    .attr('transform', 'translate(' + ((width / 2) + margins.left) + 
        ',' + ((height / 2) + margins.top) + ')');
    
    var donutWidth = 75;

    var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

    var pie = d3.pie()
    .value(function(d) { return d[1]; })
    .sort(null);

    var legendRectSize = 18;
            var legendSpacing = 4;
    
    var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) { 
        return color(d.data[0]);
    
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
    .text(function(d) { return (d === "") ? "Unknown" : d; });

    var title = svg.append("text")
        .attr("x", 0)             
        .attr("y", - margins.top - 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(chartTitle);

}
