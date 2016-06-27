var d3 = require('d3');
var React = require('react');
var ReactFauxDOM = require('react-faux-dom');
var browserHistory = require('react-router').browserHistory;

module.exports = React.createClass({
  getInitialState: function(){
    return({
    })
  },

  contextTypes: {
      router: React.PropTypes.object
  },

  loadData: function(url){
    self = this;

    d3.tsv("data/" + url, function type(d) { d.revenue = +d.revenue; return d; }, function(error, data){
      if (error) throw error;
      data.forEach(function(d){
        d.date = d3.time.format("%d.%m.%Y").parse(d.date);
        d.revenue = d.revenue/1000.0;
      });
      data.sort(function(a, b){ return a.date - b.date })

      self.setState({"data": data});
    });

  },

  componentWillReceiveProps: function(nextProps) {
    this.loadData(nextProps.config.file);
  },

  componentDidMount: function(){
    this.loadData(this.props.config.file);
  },

  prepare_d3: function(){
    var self = this;

    if(typeof this.props.config === "undefined") return <p>Loading...</p>
    if(typeof this.state.data === "undefined") return <p>Loading...</p>

    var graph = ReactFauxDOM.createElement('svg');
    var data = this.state.data;

    var margin = {top: 20, right: 20, bottom: 90, left: 90},
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
        .tickFormat(d3.time.format(this.props.config.x.format));

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
       .attr("x", 30)
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

    if( typeof this.props.config.navigation !== 'undefined') {
      svg.selectAll(".bar")
         .on('click', function(d, i) {
           var param = self.props.config.navigation;
           var value;
           var link;
           switch(param){
             case 'year':
             link = self.props.config.links.replace("{value}", d.date.getFullYear());
             break;
             case 'year,month':
             link = self.props.config.links.replace("{year}", d.date.getFullYear()).replace("{month}", ('0' + (d.date.getMonth() + 1)).slice(-2));
             break;
           }

           EventsHub.publish('navigate', link);
           self.context.router.push('/' + link)
         });
    }

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
