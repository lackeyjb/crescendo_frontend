'use strict';

angular.module('crescendoApp')
.service('AuthService', ['$http', function($http) {

  var that = this;

  that.currentUser = null;

  that.isAuthenticated = function() {
    return !!that.currentUser;
  };

  that.getSession = function() {
    var deferred = $http.get('https://crescendo-api.herokuapp.com/api/sessions');
    deferred.success(function(user) {
      console.log('getSession returned user = ' + JSON.stringify(user));
      that.currentUser = user;
    });
    return deferred;
  };

  that.getSession();

  that.register = function(user) {

    var deferred = $http.post('https://crescendo-api.herokuapp.com/api/users',
      { user: user });
    deferred.success(function(user) {
      that.currentUser = user;
    });
    return deferred;
  };

  that.login = function(session) {

    var deferred = $http.post('https://crescendo-api.herokuapp.com/api/sessions', 
      { session: session });
    deferred.success(function(user) {
      that.currentUser = user;
    });
    return deferred;
  };

  that.logout = function() {

    var deferred = $http.delete('https://crescendo-api.herokuapp.com/api/sessions');
    deferred.success(function() { 
      that.currentUser = null;
    });
    return deferred;
  };
}]);