var Graph = require('./graph');
var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({
  getInitialState: function(){
    return({
    })
  },

  loadData: function(url) {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data){
        this.setState({config: data})
      }.bind(this)
    })

  },

  getConfigUrl: function(params) {
    var url = 'data/index.json';

    if(typeof params !== 'undefined') {
      switch(params.type) {
        case 'month':
          url = 'data/month/' + params.year + '/index.json'
          break;
        case 'day':
          url = 'data/day/' + params.year + '/' + params.month + '/index.json'
          break;
      }
    }

    return url;
  },

  componentWillReceiveProps: function(nextProps) {
    var url = this.getConfigUrl(nextProps.params)

    this.loadData(url);
  },

  componentDidMount: function(){
    var url = this.getConfigUrl(this.props.params)
    this.loadData(url);

    EventsHub.subscribe('navigate', function(data) {
      console.log('navigate')
      console.log(data)
    });
  },

  render: function(){
    console.log('Component rendered.');
    if(this.state.length == 0) return <p>loading...</p>
    var graph = '';
    if(this.state.config && this.state.config.graph) {
      graph = <Graph config={ this.state.config && this.state.config.graph }/>
    }

    return(
      <div>
        <h1> { this.state.config && this.state.config.data && this.state.config.data.title } </h1>
        <ul className='year_selector'>
          <li><Link to='/'>Весь период</Link></li>
          <li><Link to='/month/2013/'>2013</Link></li>
          <li><Link to='/month/2014/'>2014</Link></li>
          <li><Link to='/month/2015/'>2015</Link></li>
        </ul>
        { graph }
      </div>
    );
  }
});
