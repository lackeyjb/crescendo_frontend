'use strict';

angular.module('crescendoApp')
.controller('MenuCtrl', ['$scope', '$state', function ($scope, $state) {

  $scope.goToGame = function() {
    $state.go('game1');
  };

  $scope.goToDashboard = function() {
    $state.go('dashboard');
  };
}]);