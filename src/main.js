var React = require('react');
var ReactDOM = require('react-dom');
var Container = require('./container');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link
var hashHistory = require('react-router').hashHistory

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
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path='/' component={Container} />
      <Route path='/:type/:year/' component={Container} />
      <Route path='/:type/:year/:month' component={Container} />
    </Router>
  ), document.getElementById('container'));
})
