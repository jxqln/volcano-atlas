const width = 600, height = 600;
const svg = d3.select("#globe").attr("width", width).attr("height", height);
const projection = d3.geoOrthographic().scale(250).translate([width / 2, height / 2]);
const path = d3.geoPath(projection);
const graticule = d3.geoGraticule();

svg.append("path")
    .datum({type: "Sphere"})
    .attr("fill", "#1E1E1E")
    .attr("stroke", "#000")
    .attr("d", path);

svg.append("path")
    .datum(graticule)
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "#666");

const zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .on("zoom", (event) => {
        projection.scale(250 * event.transform.k);
        svg.selectAll("path").attr("d", path);
        updatePoints();
    });

svg.call(zoom);

Promise.all([
    d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json"),
    d3.json("data.json")
]).then(([world, locationData]) => {
    const countries = topojson.feature(world, world.objects.countries);

    svg.selectAll(".country")
        .data(countries.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", "#a6d5ff")
        .attr("stroke", "#222");

    const validLocations = locationData.filter(d => 
        d.latitude != null && 
        d.longitude != null &&
        !isNaN(d.latitude) && 
        !isNaN(d.longitude)
    );

    const points = svg.selectAll(".point")
        .data(validLocations)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 4)
        .attr("fill", "red")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

    const tooltip = d3.select("#tooltip");

    function updatePoints() {
        points.each(function(d) {
            const coords = projection([d.longitude, d.latitude]);
            if (coords) {
                const [x, y] = coords;
                const visible = d3.geoDistance(
                    [d.longitude, d.latitude],
                    [-projection.rotate()[0], -projection.rotate()[1]]
                ) < Math.PI / 2;

                d3.select(this)
                    .attr("cx", x)
                    .attr("cy", y)
                    .style("display", visible ? null : "none");
            }
        });
    }

    points
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(
                `Year: ${d.year}<br>` +
                `Name: ${d.name}<br>` +
                `Location: ${d.location}<br>` +
                `Type: ${d.type}<br>` +
                `VEI: ${d.vei || 'Unknown'}`
            )
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    function rotateGlobe() {
        d3.timer(elapsed => {
            projection.rotate([elapsed * 0.003, -15]);
            svg.selectAll("path").attr("d", path);
            updatePoints();
        });
    }

    rotateGlobe();
});