$(document).ready(function() {
	initializeTimeline();

    // removing minimap for now
    /*var previewBody = $('#reader').minimap({
        heightRatio: 0.2,
        widthRatio: 0.3,
        offsetHeightRatio: 0,
        offsetWidthRatio: 0
    });*/
})

function initializeTimeline(){
    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 110, left: 20},
        margin2 = {top: 140, right: 20, bottom: 30, left: 20},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var parseDate = d3.timeParse("%m/%d/%Y - %H:%M:%S");

    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]);

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, 500])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.json("note.json", function(error, data) {
      if (error) throw error;

      notes = data['notes']

      x.domain(d3.extent(notes, function(d) { return parseDate(d.date); }));
      x2.domain(x.domain());

      // add first line and axes
      focus.selectAll('rect')
          .data(notes)
          .enter().append('rect')
          .attr("x", function(d){return x(parseDate(d.date))-3;})
          .attr("y", 50)
          .attr("rx", 2)
          .attr("ry", 2)
          .attr("width", 8)
          .attr("height", 18)
          .attr("fill", "steelblue");

      focus.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // add context line and axes
      context.selectAll("rect")
          .data(notes)
          .enter().append('rect')
          .attr("x", function(d){return x2(parseDate(d.date))-1;})
          .attr("y", 10)
          .attr("width", 2)
          .attr("height", 10)
          .attr("fill", "steelblue");

      context.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2);

      // add brush and zoom
      context.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, x.range());

      svg.append("rect")
          .attr("class", "zoom")
          .attr("width", width)
          .attr("height", height)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(zoom);
    });

    function brushed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
      var s = d3.event.selection || x2.range();
      x.domain(s.map(x2.invert, x2));
      focus.selectAll('rect').attr("x", function(d){return x(parseDate(d.date));});
      focus.select(".axis--x").call(xAxis);
      svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
          .scale(width / (s[1] - s[0]))
          .translate(-s[0], 0));
    }

    function zoomed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
      var t = d3.event.transform;
      x.domain(t.rescaleX(x2).domain());
      focus.selectAll('rect').attr("x", function(d){return x(parseDate(d.date));});
      focus.select(".axis--x").call(xAxis);
      context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    // this is just parsing the date info to date objects upon import
    /*function type(d) {
      d.date = parseDate(d.date);
      d.price = +d.price;
      return d;
  }*/

}
