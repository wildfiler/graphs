var React = require('react');
var ReactDOM = require('react-dom');
var Container = require('./container');

EventsHub = {
  hub: $('<div></div>'),
  publish: function(name, data) {
    console.log('Publish event: ' + name)
    this.hub.trigger(name, data)
  },
  subscribe: function(name, callback) {
    this.hub.bind(name, function(event, data) { callback(data); return true });
    return;
  }
};

$(function(){
  ReactDOM.render(<Container config="index.json" />, document.getElementById('container'));
})
