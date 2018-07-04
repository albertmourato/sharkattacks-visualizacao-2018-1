class YearHistogram {
    constructor(container, screenX, screenY, totalWidth, totalHeight, chartTitle, initialData){
        this.data = initialData;

        this.renderingArea = {x: screenX, y: screenY, width: totalWidth, height: totalHeight};
        this.margins = {top: 70, right: 5, bottom: 10, left: 25};

        this.width = this.renderingArea.width - this.margins.right - this.margins.left;
        this.height = this.renderingArea.height - this.margins.top - this.margins.bottom;

        this.canvas = container.append("g")
            .attr("transform", "translate(" + (this.renderingArea.x + this.margins.left)
            + "," + (this.renderingArea.y + this.margins.top) + ")");

        this.xScale = d3.scaleBand() 
            .domain(d3.range(this.data.length))
            .range([0, this.width])
            .round(true)
            .paddingInner(0.2)
            .paddingOuter(0.1);

        this.xAxis = d3.axisBottom(this.xScale)
            .tickValues(this.xScale.domain().filter(function(d,i){ return !(i%5)}))
            .tickFormat(d => ((this.data[d][0] === "") ? "Unknown" : this.data[d][0]));

        this.dataYInterval = d3.extent(this.data, d => d[1]);
        this.yScale = d3.scaleLinear()
            .range([this.height, 0])
            .domain([0, this.dataYInterval[1]]);
        this.yAxis = d3.axisLeft(this.yScale).ticks(3);

        this.xAxisGroup = this.canvas.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + this.height + ")"); 
        this.xAxisGroup.call(this.xAxis);

        this.yAxisGroup = this.canvas.append("g")
            .attr("class", "yAxis");
        this.yAxisGroup.call(this.yAxis);

        this.title = this.canvas.append("text")
            .attr("x", (this.width / 2))             
            .attr("y", 0 - (this.margins.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text(chartTitle);

        this.updateBars();
    }

    setData(dataset){
        this.data = dataset;
        
        var interval = d3.extent(dataset, d => d[1]);
        this.yScale.domain([0, interval[1]]);

        this.updatePlot();
    }

    updateAxis(){
        this.xAxis(this.canvas.select(".xAxis"));
        this.yAxis(this.canvas.select(".yAxis"));
    }

    updateBars(){
        var plot = this;
        var bars = this.canvas.selectAll("rect").exit().remove().data(this.data);
        //this.xScale.bandwidth()
        bars.enter()
            .merge(bars)
            .append("rect")
            .attr("x", (d, i) => this.xScale(i))
            .attr("y", d => this.yScale(d[1]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => (this.yScale(0) - this.yScale(d[1])))
            .attr("fill", "#c10707");
    }

    updatePlot(){
        this.updateAxis();
        this.updateBars();
    }
}