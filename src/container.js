var Graph = require('./graph');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    return({
    })
  },

  componentDidMount: function(){
    $.ajax({
      url: this.props.config,
      dataType: 'json',
      success: function(data){
        this.setState({config: data})
      }.bind(this)
    })

    EventsHub.subscribe('navigate', function(data) {
      console.log('navigate')
      console.log(data)
    });
  },

  render: function(){
    if(this.state.length == 0) return <p>loading...</p>
    var graph = '';
    if(this.state.config && this.state.config.graph) {
      graph = <Graph config={ this.state.config && this.state.config.graph }/>
    }
    return(
      <div>
        <h1> { this.state.config && this.state.config.data && this.state.config.data.title } </h1>
        { graph }
      </div>
    );
  }
});
