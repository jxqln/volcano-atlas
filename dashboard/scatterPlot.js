d3.json("data.json").then(function(data) {
    data = data.filter(d => d.year >= 1800 && d.total_deaths !== null);

    const margin = { top: 50, right: 50, bottom: 50, left: 60 };
    const container = d3.select("#scatter-plot").node();
    const containerWidth = container.getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
        .range([0, width]);

    const yScale = d3.scaleLog()
        .domain([1, d3.max(data, d => d.total_deaths)])
        .range([height, 0]);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, d3.max(data, d => d.total_deaths)]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.total_deaths))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.total_deaths))
        .attr("stroke", "#CACBC1")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            tooltip.html(`
                <strong>Name:</strong> ${d.name}<br>
                <strong>Year:</strong> ${d.year}<br>
                <strong>Country:</strong> ${d.country}<br>
                <strong>VEI:</strong> ${d.vei}<br>
                <strong>Total Deaths:</strong> ${d.total_deaths}
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
        .attr("color", "#CACBC1")
        .style("font-family", "Arial")
        .style("font-size", "12px");

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5, ".0f"))
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
        .text("Total Deaths (log scale)")
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