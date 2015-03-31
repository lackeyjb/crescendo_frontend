'use strict';

/**
 * @ngdoc function
 * @name crescendoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the crescendoApp
 */
angular.module('crescendoApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
