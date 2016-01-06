'use strict';

angular.module('cmeasyApp')
  .directive('adminTitle', function ($state, $log, $http, $q, appConfig) {
    return {
      templateUrl: 'components/admin-title/admin-title.html',
      restrict: 'EA',
      scope: {
        title: '@'
      },
      link: function (scope, element, attrs) {

        return init();

        /**
         *
         */
        function init(){

        }

      }
    };
  });


