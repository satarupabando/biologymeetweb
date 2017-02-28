'use strict';

var computeComposition = (function () {
  return function(input, output) {
    var GC;
    var seq = bioKit.prepSeq(document.getElementById(input).value);
    var bases = bioKit.countBase(seq);
    var length = "The length of your input sequence is " + (seq.length) + " bp, ";
    var stats = "including A: " + bases["A"] + ", T: " + bases["T"] + ", G: " + bases["G"] + " C: " + bases["C"];
    d3.select("#OT1").text("Stats of the sequence").attr("size", "4");
    d3.select(output).text(length + stats);
    GC = (Math.fround(((bases["G"] + bases["C"]) / (seq.length) * 100)) +'').slice(0, 5) + "%";
    d3.select("#GC-content").text("The GC content of your input sequence is " + GC + ".");
    let data = [
      {name: "A", count: bases["A"]},
      {name: "T", count: bases["T"]},
      {name: "G", count: bases["G"]},
      {name: "C", count: bases["C"]}
    ];
    let xScale = d3.scaleLinear().domain([0, seq.length * 0.4]).range([0, 680]);
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    var barChart = function() {
      let g = d3.select("#barChart").selectAll()
        .data(data)
        .enter()
        .append("g")
        .attr("transform", "translate(5, 0)");
      g.append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) {return i*32;})
        .attr("width", function(d) {return xScale(d.count);})
        .attr("height", 30)
        .style("fill", function(d, i) {return color(i);});
      g.append("text")
        .attr("x", function(d) { return xScale(d.count) * 0.8; })
        .attr("y", function(d, i) {return i*32 + 15;})
        .attr("dy", ".35em")
        .style("fill", "white")
        .attr("font-size", "18px")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });
      d3.select("#barChart").append("g")
        .attr("transform", "translate(5, 142)")
        .call(d3.axisBottom(xScale));
    };
    barChart();
    var pieChart = function() {
      let svg = d3.select("#pieChart");
      var A1 = data[0].count / (seq.length) * Math.PI * 2;
      var A2 = data[1].count / (seq.length) * Math.PI * 2;
      var A3 = data[2].count / (seq.length) * Math.PI * 2;
      var A4 = data[3].count / (seq.length) * Math.PI * 2;
      var Angles = [
        {name: data[0].name, start: 0, end: A1},
        {name: data[1].name, start: A1, end: A1 + A2},
        {name: data[2].name, start: A1+A2, end: A1 + A2 + A3},
        {name: data[3].name, start: A1+A2+A3, end: Math.PI * 2}
      ];
      var arc = d3.arc()
        .outerRadius(250 - 10)
        .innerRadius(0)
        .startAngle(function(d) {return d.start})
        .endAngle(function(d) {return d.end});
      var labelArc = d3.arc()
        .outerRadius(150)
        .innerRadius(150)
        .startAngle(function(d) {return d.start})
        .endAngle(function(d) {return d.end});

      var g = svg.selectAll("g")
        .data(Angles)
        .enter()
        .append("g")
        .attr("transform", "translate(250, 250)");

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); });

      g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.name; })
        .style("fill", "white")
        .attr("font-size", "22px");

    };

    pieChart();
  };
})();