'use strict';

angular.module('cmeasyApp')
  .directive('analyticsEvent', function (Analytics, $log) {
    return {
      restrict: 'A',
      scope: {
        analyticsEvent: '@',
        analyticsLabel: '@'
      },
      link: function (scope, element, attrs) {

        return init();

        /**
         *
         */
        function init() {
          if(scope.analyticsEvent){
            element.on('click', function($event){
              Analytics.trackEvent(scope.analyticsEvent, scope.analyticsLabel);
            });
          }
          else {
            $log.debug('Cannot use the analytics directive without providing a value for the analytics-event="" attribute');
          }
        }

      }
    };
  });


