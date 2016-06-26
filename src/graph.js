var d3 = require('d3');
var React = require('react');
var ReactFauxDOM = require('react-faux-dom');

module.exports = React.createClass({
  getInitialState: function(){
    return({
    })
  },

  componentDidMount: function(){
    self = this;
    d3.tsv("data/" + this.props.config.file, function type(d) { d.revenue = +d.revenue; return d; }, function(error, data){
      if (error) throw error;
      data.forEach(function(d){
        d.date = d3.time.format("%d.%m.%Y").parse(d.date);
        d.revenue = d.revenue/1000.0;
      });
      data.sort(function(a, b){ return a.date > b.date })

      self.setState({"data": data});
    });
  },

  prepare_d3: function(){
    var self = this;

    if(typeof this.props.config === "undefined") return <p>Loading...</p>
    if(typeof this.state.data === "undefined") return <p>Loading...</p>

    var graph = ReactFauxDOM.createElement('svg');
    var data = this.state.data;

    var margin = {top: 20, right: 20, bottom: 30, left: 90},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(4)
        .tickFormat(d3.time.format('%Y'));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, 'd');

    var svg = d3.select(graph)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.revenue; })]);

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .selectAll("text")
       .attr("x", 20)
       .attr("y", -4)
       .attr("transform", "rotate(90)");

    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.revenue); })
        .attr("height", function(d) { return height - y(d.revenue); });
    svg.selectAll(".bar")
       .on('click', function(d, i) {
         var link = self.props.config.links.replace("{value}", d.date.format("%Y"))
         EventsHub.publish('navigate', link);
       });

    return graph.toReact();
  },

  render: function(){
    return (
      <div className='graph'>
        { this.prepare_d3() }
      </div>
    );
  }
});
