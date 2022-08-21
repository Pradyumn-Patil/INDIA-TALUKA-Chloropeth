
let talukaData = 'http://localhost/sih/geo%20json/india_taluk.geojson.json'
let disasterURL = 'http://localhost/sih/geo%20json/Disaster_state_district_taluka_yearwise.json'
let stateURL = 'http://localhost/sih/geo%20json/states-centers.json'

//let talukaData = 'http://192.168.0.113/sih/geo%20json/india_taluk.geojson.json'
//let disasterURL = 'http://192.168.0.113/sih/geo%20json/Disaster_state_district_taluka_yearwise.json'
//let stateURL = 'http://192.168.0.113/sih/geo%20json/states-centers.json'


let countyData
let educationData
let stateCenterData
let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let select = document.getElementById('disaster');

let arrayOfID = []

let drawMap = () => {

  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 950 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  let state = document.getElementById("state")
  var stateName = state.options[state.selectedIndex].text;
  let stateData = countyData.filter(function (data) {
    return data.properties.NAME_1 === stateName;
  });
  console.log("State Name: " + stateName)

  selectedStateData = stateCenterData.filter(function (data) {
    return data.NAME_1 === stateName;
  });
  console.log(selectedStateData)


  let stateDisasterData = educationData.filter(function (data) {
    return data.state === stateName;
  });

  let stateeducationData = educationData.filter(function (data) {
    return data.state === stateName;
  });

  var LS = 0,
    EQ = 0,
    CYC = 0,
    FL = 0,
    UFL = 0,
    HWV = 0,
    TSU = 0,
    CHEM = 0,
    NUC = 0,
    BIO = 0;
  for (var i = 0; i < stateeducationData.length; i++) {
    EQ = EQ + stateeducationData[i].EQ
    LS = LS + stateeducationData[i].LS
    CYC = CYC + stateeducationData[i].CYC
    FL = FL + stateeducationData[i].FL
    UFL = UFL + stateeducationData[i].UFL
    HWV = HWV + stateeducationData[i].HWV
    TSU = TSU + stateeducationData[i].TSU
    CHEM = CHEM + stateeducationData[i].CHEM
    NUC = NUC + stateeducationData[i].NUC
    BIO = BIO + stateeducationData[i].BIO
    // caculate total event in a state in a state .
  }
  console.log("Total EQ : " + EQ)

  var scale = selectedStateData[0].scale
  var long = selectedStateData[0].long
  var lat = selectedStateData[0].lat


  console.log("State : " + stateName + ", scale " + scale + "long : " + long)

  var projection = d3.geoMercator()
    .scale(scale)
    .center([long, lat])
    .translate([width / 2 - margin.left, height / 2]);
  d3.select("#canvas")
    .selectAll("path")
    .remove();
  canvas.selectAll('path')
    .data(stateData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath().projection(projection))
    .on("click", clicked)
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
      let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      let disasterid = select.options[select.selectedIndex].value;
      console.log("disater id = " + disasterid)
      let percentage = county[disasterid]
      if (percentage <= 15) {
        return 'tomato'
      } else if (percentage <= 30) {
        return 'orange'
      } else if (percentage <= 45) {
        return 'lightgreen'
      } else {
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
    .on('mouseover', (countyDataItem) => {
      console.log('mouse over')
      let disasterid = select.options[select.selectedIndex].value;

      tooltip.transition()
        .style('visibility', 'visible')
      let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' +
        county['state'] + ' : ' + county[disasterid] + '% for Disaster ID - ' + disasterid)
      tooltip.attr('data-education', county[disasterid])
    })

    .on('mouseout', (countyDataItem) => {
      tooltip.transition()
        .style('visibility', 'hidden')
    })
}





function clicked(d) {
  let id = d['properties']['ID_3']
  drawBarChart(id)
  }







d3.json(talukaData).then(
  (data, error) => {
    if (error) {


    } else {

      countyData = data.features.filter(function (data) {
        return data.properties.NAME_0 === 'India';
      });
      console.log(countyData)
      d3.json(stateURL).then(
        (data, error) => {
          if (error) {
            console.log(log)
          } else {
            stateCenterData = data
            console.log(stateCenterData)
          }
        }

      )

      d3.json(disasterURL).then(
        (data, error) => {
          if (error) {
            console.log(log)
          } else {
            educationData = data

            drawMap()
          }
        }

      )

    }
  }
)