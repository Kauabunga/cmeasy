'use strict';

angular.module('cmeasyApp')
  .directive('adminMenuMain', function ($rootScope, $log, $state, $stateParams, appConfig, Auth, $mdSidenav) {
    return {
      templateUrl: 'components/admin-menu/admin-menu-main/admin-menu-main.html',
      restrict: 'E',
      link: function(scope, element) {

        return init();

        /**
         *
         */
        function init(){

          scope.isContentStateActive = createIsStateActive(appConfig.state.content);
          scope.isTypesStateActive = createIsStateActive(appConfig.state.types);
          scope.isUsersStateActive = createIsStateActive(appConfig.state.users);

          scope.gotoContent = _.compose(closeSidenav, $state.go.bind($state, appConfig.state.content));
          scope.gotoUsers = _.compose(closeSidenav, $state.go.bind($state, appConfig.state.users));
          scope.gotoTypes = _.compose(closeSidenav, $state.go.bind($state, appConfig.state.types, {itemType: 'schema'}));

          scope.logout = _.compose(closeSidenav, $state.go.bind($state, appConfig.state.login), Auth.logout);
        }

        /**
         *
         * @param state
         * @returns {Function}
         */
        function createIsStateActive(state){
          return function (){
            return $state.current.name === state;
          };
        }


        /**
         *
         */
        function closeSidenav(){
          $mdSidenav(appConfig.adminLeftNavId).close();
        }

      }
    };
  });
