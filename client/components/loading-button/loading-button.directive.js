(function(){

  'use strict';

  angular.module('cmeasyApp')
    .directive('loadingButton', function ($timeout, $rootScope, $log) {
      return {
        template: '<div ng-transclude=""></div>',
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
          loadingButton: '=isLoading'
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

})();
