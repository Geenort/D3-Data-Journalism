// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("/assets/data/data.csv").then(healthData => {
    
  // All values are strings, use '+' unary operator to convert to numbers
  healthData.forEach(d => {
    d.poverty = +d.poverty;
    d.smokes = +d.smokes;
  });

  console.log(healthData);

  // Create linear scales for x/y axes
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(healthData.map(d => d.poverty)))
    .range([0, chartWidth]);

  var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(healthData.map(d => d.smokes)))
    .range([chartHeight, 0]);

  // Create axes, passing scales in as arguments
  var bottomAxis = d3.axisBottom(xLinearScale).ticks(20);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(20);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG circle and text per piece of healthData
  // Use the scales to position each circle/text within the chart
  var circles = chartGroup.selectAll("circle")
    .data(healthData)
    .enter();

  circles.append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 20);
    
  circles.append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.smokes))
    .attr("class", "stateText");

  // Axes titles
  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 20})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "green")
    .text("X: In Poverty %; Y: Smokers %");
});
