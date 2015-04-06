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

  function pushData(data) {
    _.each(data, function (score) {
      $scope.scores.push(score.points);
      $scope.labels.push(score.label);
    });
    avgData($scope.scores);
  }

  function avgData(data) {
    var sum = data.reduce(function(a, b) { return a + b; });
    var avg = sum / data.length;
    $scope.avgScore = Math.floor(avg);
  }
  
  $scope.scores = [];
  $scope.labels = [];

  ScoreService.getScores()
    .success(pushData)
    .error(function () {
      console.log('Error');
    });


  this.lineData = {
    labels: $scope.labels,
    series: [
      $scope.scores
    ]
  };

  this.options = {
    height: '300px',
    width: '550px'
  };
}]);
