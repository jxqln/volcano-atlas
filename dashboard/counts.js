async function loadData() {
  const response = await fetch("record_counts.json");
  const data = await response.json();
  return data;
}

function countsByCountry(width, height, data) {
  return Plot.plot({
    width,
    height: height - 40,
    marginTop: 20,
    marginLeft: 150,
    marginBottom: 35,
    insetTop: 10,
    insetBottom: 10,
    style: {
      background: "#161616",
      color: "#CACBC1",
    },
    color: { scheme: "Viridis" },
    y: { 
      label: "Country",
      padding: 0.5
    },
    x: { 
      label: "Number of Eruptions", 
      grid: true, 
      ticks: 5, 
      tickSize: 0,
      stroke: "#CACBC1",
      line: true
    },
    marks: [
      Plot.ruleY(data, { 
        y: "Country", 
        x1: 0, 
        x2: "Record Count", 
        strokeWidth: 0.5, 
        sort: { y: "x", reverse: true },
        stroke: "#CACBC1"
      }),
      Plot.dot(data, { 
        y: "Country", 
        x: "Record Count", 
        fill: "Record Count", 
        r: 4, 
        stroke: "#CACBC1", 
        strokeWidth: 0.5, 
        sort: { y: "x", reverse: true }
      })
    ]
  });
}

async function renderPlot() {
  const data = await loadData();
  const chart = countsByCountry(400, 700, data);
  document.getElementById("chart").appendChild(chart);
}

renderPlot();