const width = 600, height = 400;
let scene = 0;
const svg = d3.select("#viz").append("svg").attr("width", width).attr("height", height);
const margin = {top: 30, right: 30, bottom: 50, left: 50};

d3.csv("cars2017.csv").then(data => {
  data.forEach(d => {
    d.city = +d["AverageCityMPG"];
    d.highway = +d["AverageHighwayMPG"];
    d.cylinders = +d["EngineCylinders"];
  });

  const x = d3.scaleLinear().domain([10, d3.max(data, d => d.city)]).range([margin.left, width - margin.right]);
  const y = d3.scaleLinear().domain([10, d3.max(data, d => d.highway)]).range([height - margin.bottom, margin.top]);

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  const circles = svg.selectAll("circle").data(data).enter().append("circle")
    .attr("cx", d => x(d.city))
    .attr("cy", d => y(d.highway))
    .attr("r", 3)
    .attr("fill", "steelblue")
    .attr("opacity", 0.6);

  d3.select("#next").on("click", () => {
    scene++;
    if (scene === 1) {
      svg.selectAll("circle")
        .transition()
        .duration(800)
        .attr("fill", d => d.cylinders > 6 ? "red" : "green");
    } else if (scene === 2) {
      svg.selectAll("circle")
        .transition()
        .duration(800)
        .attr("r", d => 2 + d.cylinders / 2);
    } else {
      scene = 0;
      svg.selectAll("circle")
        .transition()
        .duration(800)
        .attr("fill", "steelblue")
        .attr("r", 3);
    }
  });
});
