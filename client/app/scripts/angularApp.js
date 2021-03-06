'use strict';

/**
 * @ngdoc overview
 * @name crescendoApp
 * @description
 * # crescendoApp
 *
 * Main module of the application.
 */
angular
  .module('crescendoApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'angular-chartist',
    'ui.gravatar'
  ])
  .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {

    $httpProvider.defaults.withCredentials = true;

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        onEnter: ['$state', 'AuthService', function ($state, AuthService) {
          if (!AuthService.isAuthenticated()) {
            $state.go('home');
          }
        }]
      })
      .state('game1', {
        url: '/game1',
        templateUrl: 'views/game1.html',
        controller: 'Game1Ctrl',
        onEnter: ['$state', 'AuthService', function ($state, AuthService) {
          if (!AuthService.isAuthenticated()) {
            $state.go('home');
          }
        }]
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl'
      });
      
      $urlRouterProvider.otherwise('/');
  })
  .config( ['gravatarServiceProvider', function (gravatarServiceProvider) {
    gravatarServiceProvider.defaults = { 'default': 'mm' };
    gravatarServiceProvider.secure   = true;
    gravatarServiceProvider.protocol = 'my-protocol';
  }]);
