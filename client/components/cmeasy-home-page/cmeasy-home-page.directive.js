'use strict';

angular.module('cmeasyApp')
  .directive('cmeasyHomePage', function ($state, $log, $http, $q, $stateParams) {
    return {
      templateUrl: 'components/cmeasy-home-page/cmeasy-home-page.html',
      restrict: 'EA',

      scope: {},
      link: function (scope, element, attrs) {

        return init();

        /**
         *
         */
        function init() {

        }

      }
    };
  });


