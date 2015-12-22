'use strict';

angular.module('cmeasyApp.admin')
  .config(function($stateProvider) {

    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        abstract: true
      });

  });
