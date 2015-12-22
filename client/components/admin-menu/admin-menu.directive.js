'use strict';

angular.module('cmeasyApp')
  .directive('adminMenu', function ($rootScope, $log, $state, $stateParams, appConfig) {
    return {
      templateUrl: 'components/admin-menu/admin-menu.html',
      restrict: 'E',
      link: function(scope, element) {

        return init();

        /**
         *
         */
        function init(){
          scope.$on('$destroy', $rootScope.$on('$stateChangeSuccess', handleStateChangeSuccess));
          handleStateChangeSuccess({}, $state.current, $stateParams, {}, {});
        }

        /**
         *
         */
        function handleMenuIndexChange(index){
          $log.debug('menu index', $state.current.menuIndex, index);
          if(index !== undefined && $state.current.menuIndex !== index){
            //go to index state
            $state.go(getIndexState(index));
          }
        }

        /**
         *
         * @param index
         * @returns {*}
         */
        function getIndexState(index){
          return _($state.get()).filter(function(state){return state && state.menuIndex === index;}).first();
        }

        /**
         *
         */
        function handleStateChangeSuccess(event, toState, toParams, fromState, fromParams){
          $log.debug('to state', toState);
          scope.menuIndexWatcher && scope.menuIndexWatcher(); //jshint ignore:line
          scope.menuIndex = toState.menuIndex;
          scope.menuIndexWatcher = scope.$watch('menuIndex', handleMenuIndexChange);
        }

      }
    };
  });
