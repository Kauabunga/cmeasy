'use strict';

angular.module('cmeasyApp.admin')
  .config(function($stateProvider) {

    $stateProvider
      .state('admin', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        abstract: true
      });

  });
