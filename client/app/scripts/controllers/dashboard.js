'use strict';

angular.module('crescendoApp')
.controller('DashboardCtrl', ['$scope', '$state', 'AuthService', 'ScoreService', 
function ($scope, $state, AuthService, ScoreService) {
  
  AuthService.getSession().success(function (user) {
    $scope.user = user;
  });

  $scope.goToGame = function() {
    $state.go('game1');
  };

  ScoreService.getScores().success(function (data) {
    $scope.scores = [];

    _.map(data, function (score) {
      $scope.scores.push(score.points);
    });
  })
  .error(function () {
    console.log('Error');
  });



}]);