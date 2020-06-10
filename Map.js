// dimension setting 


// draw map function (render basic geo path to DOM)
async function drawTaiwanTownMap() {
  // canvas dimension
  const width = window.innerWidth;
  const height = window.innerHeight;

  // data input
  const twTownResponse = await fetch("./data/tw_town.json")
  const twTownData = await twTownResponse.json()
  const twTownFeatures = topojson.feature(twTownData, twTownData.objects.tw_town).features

  const twCountyResponse = await fetch("./data/tw_county.json")
  const twCountyData = await twCountyResponse.json()
  const twCountyFeatures = topojson.feature(twCountyData, twCountyData.objects.tw_county).features
  console.log(twCountyFeatures);

  // projection setting
  const twProjection = d3.geoMercator()
      .translate([width / 2, height / 2])
      .scale(10000)
      .center([121, 23.84394])

  const twGeoPath = d3.geoPath()
      .projection( twProjection )
  
  // draw tw county map
  const svg = d3.select(".interactive-map svg")
    .attr("width", width)
    .attr("height", height)

  const counties = svg.selectAll(".county")
    .data(twCountyFeatures)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("id", d => d.properties['COUNTYNAME'])
    .attr("fill", "#25877F")
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5)
    .attr("d", twGeoPath)
    .on("click", function (d) { countyZoom(d.properties.COUNTYID) })


  // zoom func
  function backToCounty() {
    const t = d3.transition().duration(800)

    twProjection.scale(10000).translate([width / 2, height / 2])

    counties.transition(t)
        .attr("d", twGeoPath)
        .attr("opacity", 1)
        .style("fill", "#25877F")

    svg.selectAll(".town")
        .data([])
        .exit().transition(t)
        .attr("d", twGeoPath)
        .style("opacity", 0)
        .remove()
  }

  function countyZoom(COUNTYID) {
    const county = twCountyFeatures.find(function (d) { return d.properties.COUNTYID === COUNTYID })
    const countyTowns = twTownFeatures.filter(function (d) { return d.properties.COUNTYID === COUNTYID })

    const t = d3.transition().duration(800)

    const towns = svg.selectAll('.town')
        .data(countyTowns, function (d) { return d.properties.COUNTYID })

    const enterTownPaths = towns.enter().append('path')
        .attr("class", "town")
        .attr("d", twGeoPath)
        .style("fill",  "#25877F")
        .style("opacity", 0)
        .on("click", function () { backToCounty() })

        twProjection.fitExtent(
        [[30, 30], [width - 30, height - 30]],
        county
    )

    counties.transition(t)
        .attr('d', twGeoPath)
        .attr("opacity", 0.5)
        .style('fill', '#25877F')

    enterTownPaths.transition(t)
        .attr('d', twGeoPath)
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .style('opacity', 1)

    towns.exit().transition(t)
        .attr('d', twGeoPath)
        .style('opacity', 0)
        .remove()
}


}

drawTaiwanTownMap()