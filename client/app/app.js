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
  .config(function($urlRouterProvider, $locationProvider, $logProvider, $mdThemingProvider) {

    $urlRouterProvider.otherwise('/admin/main');
    $locationProvider.html5Mode(true);

    $logProvider.debugEnabled( ! window._cmeasy || window._cmeasy.env === 'development');

    $mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('purple').warnPalette('orange');
  });
