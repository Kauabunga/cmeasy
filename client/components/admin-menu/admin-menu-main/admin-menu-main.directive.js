'use strict';

angular.module('cmeasyApp')
  .directive('adminMenuMain', function ($rootScope, $log, $state, $stateParams, appConfig) {
    return {
      templateUrl: 'components/admin-menu/admin-menu-main/admin-menu-main.html',
      restrict: 'E',
      link: function(scope, element) {

        return init();

        /**
         *
         */
        function init(){
          scope.gotoContent = gotoContent;
        }

        /**
         *
         */
        function gotoContent(){
          $state.go(appConfig.state.content)
        }

      }
    };
  });
