'use strict';

angular.module('cmeasyApp')
  .directive('adminMenuMain', function ($rootScope, $log, $state, $stateParams, appConfig, Auth) {
    return {
      templateUrl: 'components/admin-menu/admin-menu-main/admin-menu-main.html',
      restrict: 'E',
      link: function(scope, element) {

        return init();

        /**
         *
         */
        function init(){
          scope.gotoContent = $state.go.bind($state, appConfig.state.content);
          scope.logout = _.compose($state.go.bind($state, appConfig.state.login), Auth.logout);
        }

      }
    };
  });
