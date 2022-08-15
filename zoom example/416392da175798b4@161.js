// https://observablehq.com/@d3/zoom-to-bounding-box@161
function _1(md){return(
md`# Zoom to Bounding Box

Pan and zoom, or click to zoom into a particular state using [*zoom*.transform](https://github.com/d3/d3-zoom/blob/master/README.md#zoom_transform) transitions. The bounding box is computed using [*path*.bounds](https://github.com/d3/d3-geo/blob/master/README.md#path_bounds).`
)}

function _chart(d3,topojson,us,path)
{
  const width = 975;
  const height = 610;

  const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .on("click", reset);

  const g = svg.append("g");

  const states = g.append("g")
      .attr("fill", "#444")
      .attr("cursor", "pointer")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .join("path")
      .on("click", clicked)
      .attr("d", path);
  
  states.append("title")
      .text(d => d.properties.name);

  g.append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

  svg.call(zoom);

  function reset() {
    states.transition().style("fill", null);
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    states.transition().style("fill", null);
    d3.select(this).transition().style("fill", "red");
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }

  function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  return svg.node();
}


function _3(md){return(
md`## Annex

Thanks to [John Guerra](/@john-guerra) for suggestions.`
)}

function _path(d3){return(
d3.geoPath()
)}

function _us(FileAttachment){return(
FileAttachment("states-albers-10m.json").json()
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _d3(require){return(
require("d3@7")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["states-albers-10m.json", {url: new URL("http://localhost/sih/zoom%20example/states-albers-10m.json", import.meta.url), mimeType: null, toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","topojson","us","path"], _chart);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("path")).define("path", ["d3"], _path);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
