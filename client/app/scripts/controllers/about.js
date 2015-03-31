'use strict';

/**
 * @ngdoc function
 * @name crescendoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the crescendoApp
 */
angular.module('crescendoApp')
  .controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
