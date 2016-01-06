'use strict';

angular.module('cmeasyApp')
  .directive('adminMenu', function ($rootScope, $log, Admin, $state, $stateParams, appConfig, $timeout) {
    return {
      templateUrl: 'components/admin-menu/admin-menu.html',
      restrict: 'E',
      link: function(scope, element) {

        return init();

        /**
         *
         */
        function init(){

          scope.goHome = $state.go.bind($state, appConfig.state.main);
          scope.$on('$destroy', $rootScope.$on('$stateChangeSuccess', handleStateChangeSuccess));
          handleStateChangeSuccess({}, $state.current, $stateParams, {}, {});

          updateModels();
          scope.$on('$destroy', $rootScope.$on('$stateChangeSuccess', updateModels));
        }


        /**
         *
         * @returns {*}
         */
        function updateModels(){
          return Admin.getModels()
            .then(function(models){
              $timeout(() => {scope.menuItems = models;});
        });
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
