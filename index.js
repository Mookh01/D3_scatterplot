var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(url, function(error, json) {

  //format the time line / x-axis
  timeFormat = d3.time.format("%H:%M"),
  minuteFormat = function(d) {
    var time = new Date(2012, 0, 1, 0, d)
    time.setSeconds(time.getSeconds() + d);
    return timeFormat(time);
  };
  var first = json[0].Seconds;
  json.forEach(function(cyclist) {
    cyclist.slower = cyclist.Seconds - first;
  });
  var colnames = Object.keys(json[0]);

  // transforms the json key:value pairs to have new "key" names
  json = JSON.parse(JSON.stringify(json).split('"' + colnames[8] + '":').join('"x":')); // x
  json = JSON.parse(JSON.stringify(json).split('"' + colnames[1] + '":').join('"y":')); // y
  var margin = {
      top: 103,
      right: 1,
      bottom: -40,
      left: 60
    },
    w = 750,
    h = 650;
  var svg = d3.select("body").append("svg").attr("width", w + 320). //effects the width of shown svg
  attr("height", h + 140). //effects the height of shown svg
  append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear().range([(w), 0]) //moves the x-axis
  var y = d3.scaleLinear().range([0, h]) //moves the y-axis
  var xAxis = d3.axisBottom().scale(x). //positions x-axis
  tickFormat(minuteFormat)
  var yAxis = d3.axisLeft().scale(y); //positions y-axis

  //adds length and range of x & y axis.
  y.domain(d3.extent(json, function(d) {
    return (d.y)
  })); //displays the number of cyclists
  x.domain(d3.extent(json, function(d) {
    return (d.x)
  })); //increases length/range of x-axis

  //adds the cyclists names to the chart.
  svg.selectAll("text").data(json).enter().append("text").attr("class", "athlete").text(function(d) {
    return d.Name;
  }).attr("x", function(d) {
    return x(d.x);
  }).attr("y", function(d) {
    return y(d.y);
  }).attr("transform", "translate(30,6)");

  svg.append("g").attr("class", "x axis"). //creates a class name for x axis.
  attr("transform", "translate(0," + (h + 15) + ")"). //adjusts x-axis line (horiz, vert) but doesn't move points
  call(xAxis).append('text').attr('class', 'xAx').attr('x', 400).attr('y', 50).attr('transform', 'rotate(0)').text('Time Behind Fastest Time');

  svg.append("g").attr("class", "y axis").attr("transform", "translate(-6,0)"). //adjusts y-axis line (horiz, vert) but doesn't move circle plot points
  call(yAxis).append('text').attr('class', 'yAx').attr('x', -100).attr('y', -50).attr('transform', 'rotate(-90)').text('Ranking');

  svg.append("text"). //creates the title
  attr("x", (w / 2)).attr("y", margin.top - 120).attr("text-anchor", "middle").attr('class', 'title').text("Doping in Professional Bicycle Racing");

  svg.append("text"). //creates the sub-title
  attr("x", (w / 2)).attr("y", margin.top - 60).attr("text-anchor", "middle").attr('class', 'xAx').text("35 Fastest times up Alpe d'Huez");

  svg.selectAll(".point").data(json).enter().append("circle").attr("class", "point").attr("r", 8).attr("cy", function(d) {
    return y(d.y);
  }).attr("cx", function(d) {
    return x(d.x);
  }).attr("fill", function(d) {
    if (d.Doping == "") {
      return "green";
    }
    return "red";
  })
  //-----tooltip ----------------------
    .on('mouseover', function(d) {
    var xCoordinate = parseFloat(d3.select(this).attr("cx"));
    var yCoordinate = parseFloat(d3.select(this).attr("cy"));
    (yCoordinate < 150)
      ? yCoordinate = 150
      : yCoordinate;
    (xCoordinate > 560)
      ? xCoordinate = 580
      : xCoordinate;
    if (d.Doping === "") {
      d.Doping = "No Doping Alligations";
    }
    d3.select("#tooltip").style("left", (xCoordinate + 500) + "px").style("top", (yCoordinate) + "px").select("#value").html("<strong>" + d.Name + "</strong>" + "<p> Nationality: " + d.Nationality + "</p>" + "<p> Time: " + d.Time + "</p>" + "<br><p> " + d.Doping + "</p>");
    d3.select("#tooltip").classed("hidden", false);
  }).on('mouseout', function(d) {
    d3.select("#tooltip").classed("hidden", true);
  });

  // ---- Legend Attributes -----------
  svg.append("circle").attr("cx", function(d) {
    return x(10);
  }).attr("cy", function(d) {
    return y(20);
  }).attr("r", 10).attr("fill", "green");

  svg.append("text").attr("x", function(d) {
    return x(5);
  }).attr("y", function(d) {
    return y(20);
  }).attr("text-anchor", "left").attr("class", "legend").text("No doping allegations");

  //red circle
  svg.append("circle").attr("cx", function(d) {
    return x(10);
  }).attr("cy", function(d) {
    return y(23);
  }).attr("r", 10).attr("fill", "red");

  svg.append("text").attr("x", function(d) {
    return x(5);
  }).attr("y", function(d) {
    return y(23) + 8;
  }).attr("text-anchor", "left").attr("class", "legend").text("Riders with doping allegations");

}); //d3.json
