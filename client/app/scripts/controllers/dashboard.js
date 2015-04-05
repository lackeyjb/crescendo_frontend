'use strict';

angular.module('crescendoApp')
.controller('DashboardCtrl', ['$scope', 'AuthService', 'ScoreService', 
function ($scope, AuthService, ScoreService) {
  
  AuthService.getSession().success(function(user) {
    $scope.user = user;
  })

}])