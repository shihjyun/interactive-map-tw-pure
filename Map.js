// dimension setting 


// draw map function (render basic geo path to DOM)
async function drawTaiwanTownMap() {
  // canvas dimension
  const width = 600;
  const height = 700;

  // data input
  const response = await fetch("./data/tw_town_geo.json")
  const twTownData = await response.json()
  const twTownFeatures = topojson.feature(twTownData, twTownData.objects.tw_town_adjusted_bind_data).features

  // projection setting
  const twProjection = d3.geoMercator()
      .scale(6000)
      .center([122, 23.84394])

  const twgeoPath = d3.geoPath()
      .projection( twProjection );
  

  const svg = d3.select(".interactive-map svg")
    .attr("width", width)
    .attr("height", height)

  svg.selectAll("path")
    .data(twTownFeatures)
    .enter()
    .append("path" )
    .attr("id", d => d.properties['TOWNNAME'])
    .attr("fill", "#E3DBD9")
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5)
    .attr("d", twgeoPath );
}

drawTaiwanTownMap()