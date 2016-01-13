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

          scope.isDashboardStateActive = createIsStateActive(appConfig.state.main);
          scope.isContentStateActive = createIsStateActive(appConfig.state.content);
          scope.isTypesStateActive = createIsStateActive(appConfig.state.types);
          scope.isUsersStateActive = createIsStateActive(appConfig.state.users);

          scope.gotoContent = $state.go.bind($state, appConfig.state.content);
          scope.gotoDashboard = $state.go.bind($state, appConfig.state.main);
          scope.gotoTypes = $state.go.bind($state, appConfig.state.types, {itemType: 'schema'});

          scope.logout = _.compose($state.go.bind($state, appConfig.state.login), Auth.logout);
        }

        /**
         *
         * @param state
         * @returns {Function}
         */
        function createIsStateActive(state){
          return function (){
            return $state.current.name === state;
          }
        }


      }
    };
  });
