'use strict';

angular.module('crescendoApp')
.controller('NavCtrl', ['$scope', '$rootScope', '$state', '$browser', 'AuthService',
  function ($scope, $rootScope, $state, $browser, AuthService) {

    $scope.tabs = [
      { state: 'home',  label: 'Home', active: true, isPublic: true },
      { state: 'dashboard', label: 'Dashboard', active: true, isPublic: false }
    ];

    $scope.getTabClass = function(tab) {
      return tab.active ? 'active' : '';
    };

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tabs.forEach(function(tab) {
        tab.active = $state.is(tab.state);
      });
    });

    $scope.isAuthenticated = function() {
      return !!$scope.user;
    };

    $scope.showTab = function(tab) {
      return tab.isPublic || $scope.isAuthenticated();
    };

    AuthService.getSession().success(function(user) {
      $scope.user = user;
    });

    $scope.logout = function() {
      AuthService.logout().success(function() {
        $rootScope.$emit('auth:logout');
      });
    };

    $rootScope.$on('auth:new-registration', function(event, user) {
      $scope.user = user;
      $state.go('dashboard');
    });

    $rootScope.$on('auth:login', function(event, user) {    
      $scope.user = user;
      $state.go('dashboard');
    });

    $rootScope.$on('auth:logout', function(/* event, user */) {
      $scope.user = null;
      $state.go('home');
    });
}]);