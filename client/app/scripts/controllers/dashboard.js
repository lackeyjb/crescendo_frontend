'use strict';

angular.module('crescendoApp')
.controller('DashboardCtrl', ['$scope', '$state', 'AuthService', 'ScoreService', 
function ($scope, $state, AuthService, ScoreService) {
  
  $scope.user   = null;
  $scope.scores = [];
  $scope.labels = [];

  AuthService.getSession().success(function (user) {
    $scope.user = user;
  });

  $scope.goToGame = function() {
    $state.go('game1');
  };

  function avgGameData(data) {
    var sum = data.reduce(function(a, b) { return a + b; });
    var avg = sum / data.length;
    $scope.avgScore = Math.floor(avg);
  }

  function gameData(data) {
    _.each(data, function (score) {
      $scope.scores.push(score.points);
      $scope.labels.push(score.label);
    });
    avgGameData($scope.scores);
  }

  ScoreService.getScores()
    .success(gameData)
    .error(function () {
      console.log('Error');
    });

  // These are points on the chart
  this.lineData = {
    labels: $scope.labels,
    series: [$scope.scores]
  };

  // Modal
  $('#myModal').on('hidden.bs.modal', function (e) {
  $('#myModal iframe').attr('src', $('#myModal iframe').attr('src'));
  });
}]);