'use strict';

// This service authenticates the user

angular.module('crescendoApp')
.service('AuthService', ['$http', function ($http) {
  var that = this;

  that.currentUser = null;

  that.isAuthenticated = function() {
    return !!that.currentUser;
  };

  that.register = function(user) {

    var deferred = $http.post('/api/users/', { user: user });
    deferred.success(function(user) {
      that.currentUser = user;
    });
    return deferred;
  };

  that.login = function(session) {

    var deferred = $http.post('/api/sessions/', { session: session });
    deferred.success(function(user) {
      that.currentUser = user;
    });
    return deferred;
  };

  that.logout = function() {

    var deferred = $http.delete('/api/sessions/');
    deferred.success(function() { 
      that.currentUser = null;
    });
    return deferred;
  };

  that.getSession = function() {

    var deferred = $http.get('/api/sessions/');
    deferred.success(function(user) {
      that.currentUser = user;
    });
    return deferred;
  };  

  that.getSession();
}]);