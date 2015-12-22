'use strict';

angular.module('cmeasyApp', [
  'cmeasyApp.auth',
  'cmeasyApp.admin',
  'cmeasyApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngMaterial',
  'ngStorage',
  'formly',
  'btford.socket-io',
  'ui.router',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/admin/main');
    $locationProvider.html5Mode(true);

  });
