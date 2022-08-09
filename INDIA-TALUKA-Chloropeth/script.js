let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let localcountyURL = 'http://localhost/sih/geo%20json/america-county-geojson.json'
let talukaData = 'http://localhost/sih/geo%20json/india_taluk.geojson.json'
let educationURL = 'http://localhost/sih/geo%20json/educationDataTaluka.json'

let countyData
let educationData
let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let arrayOfID = [] 

let drawMap = () => {
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 950 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    var projection = d3.geoMercator()
        .scale(1000)
        .center([80,22])
        .translate([width / 2 - margin.left, height / 2]);
        canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath().projection(projection))
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
          
          let id = countyDataItem['properties']['ID_3']
          let county = educationData.find((item) => {
              return item['fips'] === id
          })
          let percentage = county['bachelorsOrHigher']
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

      let percentage = county['bachelorsOrHigher']
      return percentage
  })
  .on('mouseover',(countyDataItem)=>{
    console.log('mouse over')
    tooltip.transition()
                    .style('visibility', 'visible')
    let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
          return item['fips'] === id
      })
      tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                    county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
      tooltip.attr('data-education', county['bachelorsOrHigher'] )
      console.log(county['fips'] + ' - ' + county['area_name'] + ', ' + 
      county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
  })

  .on('mouseout', (countyDataItem) => {
    tooltip.transition()
        .style('visibility', 'hidden')
})
}

d3.json(talukaData).then(
    (data,error)=>{
       if(error){
        console.log(log)
        
       } else{

        countyData = data.features
        console.log(countyData)

        d3.json(educationURL).then(
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