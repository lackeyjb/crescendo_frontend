'use strict';

angular.module('crescendoApp')
.controller('AuthCtrl', ['$scope', '$rootScope', '$AuthService',
  function($scope, $rootScope, AuthService) {

  $scope.register = function() {

    AuthService.register($scope.user)
    .success(function(user) {
      $rootScope.$emit('auth:new-registration', user);
    })
    .error(function() {
      alert('Something went wrong, please try again.');
    });
  };

  $scope.login = function() {
    AuthService.login($scope.session)
    .success(function(user) {
      $rootScope.$emit('auth:login', user);
    })
    .error(function() {
      alert('Something went wrong, please try again.');
      $scope.session = {};
    });
  };
}]);