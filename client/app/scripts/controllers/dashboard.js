'use strict';

angular.module('crescendoApp')
.controller('DashboardCtrl', ['$scope', '$state', 'AuthService', 'ScoreService', 
function ($scope, $state, AuthService, ScoreService) {
  
  AuthService.getSession().success(function(user) {
    $scope.user = user;
  })

  $scope.goToGame = function() {
    $state.go('game1');
  };

}])