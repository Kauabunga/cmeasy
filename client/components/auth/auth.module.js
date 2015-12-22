'use strict';

angular.module('cmeasyApp.auth', [
  'cmeasyApp.constants',
  'cmeasyApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
