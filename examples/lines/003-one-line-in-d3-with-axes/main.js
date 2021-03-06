/**
 * ADD YOUR CODE BELOW
 * LIKE LEGO BLOCKS, PIECE BY PIECE!
 */

const width = 720;
const height = 600;
const margin = {top: 20, right: 40, bottom: 20, left: 40};
let drawing;
let drawingArea;
let lineData;
let myPath;
let xAxis, yAxis, xScale, yScale;

async function setup(){
  try{
    // create your drawing area and add it to the page
    // NOTE: we have a <div id="drawing"></div> on index.html
    drawing = d3.select("#drawing").append("svg");
    // set the size of your drawing area
    drawing
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "#D8D8D8")


    // add a group to your drawing
    drawingArea = drawing.append("g")
    // move your drawing area to have padding
    // don't add .style here unless you want
    // those styles to propogate down
    drawingArea
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // send some data to lineData
    lineData = await d3.csv("data/temperature.csv")
    lineData = lineData.map((d) => {
        let parsedDate = d.date.split("/")
        let year = parsedDate[2]
        let month = parsedDate[1]
        let day = parsedDate[0]
        d.dateTime = new Date(`${year}-${month}-${day} ${d.time}`)
        return d;
    })

    // NOTE: THIS IS NEW
    // we append our path in setup since
    // we are just adding data to it later
    myPath = drawingArea.append("path")

    xAxis = drawingArea.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "xAxis")


    yAxis = drawingArea.append("g")
      .attr("class", "yAxis")


    return lineData

  } catch(err){
    return err
  }

}

function make(lineData){

  xScale = d3.scaleTime()
    .domain([new Date("2018-08-05 22:25:02.000"), new Date("2018-08-05 22:52:26.000")])
    .range([10, width - 10]);

  let yMin = d3.min( lineData.map( (d) => d.thermocouple_t)  )
  let yMax = d3.max( lineData.map( (d) => d.thermocouple_t)  )
  yScale = d3.scaleLinear()
    .domain([yMin - 1, yMax ])
    .range([height, 0]);

  // NOTE: THIS IS NEW
  // d3 line generator!
  let lineGenerator = d3.line()
        .x( (d) => xScale(d.dateTime) )
        .y( (d) => yScale(d.thermocouple_t) )
        .curve(d3.curveNatural)

  // NOTE: myPath is a created path in setup().
  myPath
    .style("stroke-width", 10)
    .transition()
    .duration(1000)
    .attr("d", lineGenerator(lineData) )
    .attr("class", "myPath")
    .style("stroke", "tomato")
    .style("stroke-width", 4)
    .style("fill", "none")

  drawingArea.select(".xAxis")
    .call(d3.axisBottom(xScale))

  drawingArea.select(".yAxis")
    .call(d3.axisLeft(yScale))

}

setup().then(make)
