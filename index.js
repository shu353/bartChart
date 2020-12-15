fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((res) => {
    const dataset = res.data;

    drawCanvas();
    generateScale(dataset);
    drawBars(dataset);
    generateAxis();
  });

let heightScale;
let xScale;
let xAxisScale;
let yAxsisScale;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select("svg");

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScale = (dataset) => {
  heightScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, width - padding]);

  const dateValues = dataset.map((d) => new Date(d[0]));
  console.log(dateValues);

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(dateValues), d3.max(dateValues)])
    .range([padding, width - padding]);

  yAxsisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, padding]);
};

const drawBars = (dataset) => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2 * padding) / dataset.length)
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("height", (d) => heightScale(d[1]))
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => height - padding - heightScale(d[1]))
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");

      tooltip.text(d[0]);

      document.querySelector("#tooltip").setAttribute("data-date", d[0]);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const generateAxis = () => {
  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxsisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};
