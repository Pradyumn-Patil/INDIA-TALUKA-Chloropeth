


var graph = {
    "nodes": [{
    "name": "a",
    "group": 1
    }, {
    "name": "b",
    "group": 8
    }],
    "links": [{
    "source": 1,
    "target": 0,
    "value": 1
    }
 };
   var width = 600;var height = 600;
  function getPosition(force) {
   return force.nodes().map(function(node) {
      return {
      name: node.name,
      group: node.group,
      x: node.x,
      y: node.y
     }
   })
 }
 var color = d3.scaleOrdinal(d3.schemeCategory10);       
 var simulation = d3.forceSimulation(nodes)
              .force("link", d3.forceLink().id(function(d,i) {
                  return i;
              }).distance(30))
              .force("charge", d3.forceManyBody().strength(-120 ))
              .force("center", d3.forceCenter(width / 2,height / 2))
              .on('end', function(){
                  var position = getPosition(simulation);
                  console.log(position)
                  });  
  var svg = d3.select("body").append("svg")
   .attr("width", width)
   .attr("height", height);
  var drawGraph = function(graph) {
     var link = svg.append('g')
                .attr('class','links')
                .selectAll("line")
                .data(graph.link)
                .enter()
                .append("line");  
  var nodes = svg.append('g').attr("class", "nodes")
                 .selectAll("g")
                 .data(graph.nodes)
                 .enter()
                 .attr("r", 10)
                 .style("fill", function(d) {
                      return color(d.group);
                  })
                  .append("title")
                  .text(function(d) {
                          return d.name;
                  })
                 .call(simulation.drag);                              
  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);
  simulation.force("link")
    .links(graph.links);
     function ticked(){
          links.attr("x1", function(d) { return d.source.x; })
             .attr("y1", function(d) { return d.source.y; })
             .attr("x2", function(d) { return d.target.x; })
             .attr("y2", function(d) { return d.target.y; });
          nodes.attr("cx", function(d) { return d.x; })
             .attr("cy", function(d) { return d.y; });

     };
    drawGraph(graph);