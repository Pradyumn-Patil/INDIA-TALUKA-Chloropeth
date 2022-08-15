let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let localcountyURL = 'http://localhost/sih/geo%20json/america-county-geojson.json'
let talukaData = 'http://localhost/sih/geo%20json/india_taluk.geojson.json'
let educationURL = 'http://localhost/sih/geo%20json/educationDataTaluka.json'
let disasterURL = 'http://localhost/sih/geo%20json/disasters.json'

let countyData
let educationData
let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let select = document.getElementById('disaster');

let arrayOfID = [] 

let drawMap = () => {

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 950 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    centered;
    
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

    var projection = d3.geoMercator()
        .scale(1000)
        .center([80,22])
        .translate([width / 2 - margin.left, height / 2]);
        d3.select("g")
        .selectAll("path")
        .remove();
        var path = d3.geoPath()
            .projection(projection);
        var appending = svg.selectAll('g')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', path)
        .on("click", clicked)
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {

          console.log(countyData) ;
          
          let id = countyDataItem['properties']['ID_3']
          let county = educationData.find((item) => {
              return item['fips'] === id
          })
          let disasterid = select.options[select.selectedIndex].value;
          console.log("disater id = " +disasterid)
          let percentage = county[disasterid]
          if(percentage <= 15){
              return 'tomato'
          }else if(percentage <= 30){
              return 'orange'
          }else if(percentage <= 45){
              return 'lightgreen'
          }else{
              return 'limegreen'
          }
      })
      .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
      let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
          return item['fips'] === id
      })
      let disasterid = select.options[select.selectedIndex].value;
      let percentage = county[disasterid]
      return percentage
  })
  .on('mouseover',(countyDataItem)=>{
    console.log('mouse over')
    let disasterid = select.options[select.selectedIndex].value;

    tooltip.transition()
                    .style('visibility', 'visible')
    let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
          return item['fips'] === id
      })
      tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                    county['state'] + ' : ' + county[disasterid] + '% for Disaster ID - ' + disasterid )
      tooltip.attr('data-education', county[disasterid] )
  })

  .on('mouseout', (countyDataItem) => {
    tooltip.transition()
        .style('visibility', 'hidden')
})

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
  } else {
      x = width / 2 - margin.left;
      y = height / 2;
      k = 1;
      centered = null;
  }

  svg.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });
let nwidth = width / 2 - margin.left 
  svg.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");
}

}


d3.json(talukaData).then(
    (data,error)=>{
       if(error){
        console.log(log)
        
       } else{

        countyData = data.features.filter(function (data) {
          return data.properties.NAME_0 === 'India';
      });
        console.log(countyData)

        d3.json(disasterURL).then(
            (data,error)=>{
              if(error){
                console.log(log)
              } else {
                educationData = data
                console.log(educationData)
                drawMap()                
              }
            }
    
        )
       }
    }
)