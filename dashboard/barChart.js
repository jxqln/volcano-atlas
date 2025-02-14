d3.json("data.json").then(function(data) {
    data = data.filter(d => d.year >= 1800);
    const groupedData = d3.rollup(data, v => v.length, d => d.year);
    const barData = Array.from(groupedData, ([year, count]) => ({ year, count }))
        .sort((a, b) => a.year - b.year);

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const container = d3.select("#bar-chart").node();
    const containerWidth = container.getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(barData.map(d => d.year))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.count)])
        .range([height, 0]);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, d3.max(barData, d => d.count)]);

    svg.selectAll(".bar")
        .data(barData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.count))
        .attr("fill", d => colorScale(d.count))
        .attr("stroke", "#CACBC1")
        .attr("stroke-width", 0.5)
        .on("mouseover", function(event, d) {
            tooltip.html(`Year: ${d.year}<br>Total Eruptions: ${d.count}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

    const xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => d % 50 === 0))
        .tickFormat(d3.format("d"));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .attr("color", "#CACBC1")
        .style("font-family", "Arial")
        .style("font-size", "12px");

    svg.append("g")
        .call(d3.axisLeft(yScale))
        .attr("color", "#CACBC1")
        .style("font-family", "Arial")
        .style("font-size", "12px");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Year")
        .attr("fill", "#CACBC1")
        .style("font-family", "Arial")
        .style("font-size", "12px");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text("Number of Volcanic Events")
        .attr("fill", "#CACBC1")
        .style("font-family", "Arial")
        .style("font-size", "12px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("color", "black")
        .style("font-family", "Arial")
        .style("font-size", "12px");
});