'use strict';

angular.module('cmeasyApp')
  .directive('adminMenuTypes', function ($rootScope, Admin, $log, $state, appConfig, Util, $stateParams) {
    return {
      templateUrl: 'components/admin-menu/admin-menu-types/admin-menu-types.html',
      restrict: 'E',
      scope: {
        menuItems: '='
      },
      link: function(scope, element) {

        return init();

        /**
         *
         */
        function init(){
          scope.openMenu = openMenu;
          scope.getMenuDisplay = getMenuDisplay;
          scope.isMenuActive = isMenuActive;
        }

        /**
         *
         */
        function openMenu($event, menuItem){

          let params = {
            itemType: 'schema',
            itemId: getId(menuItem)
          };

          $state.transitionTo(appConfig.state.type, params);
        }

        /**
         *
         * @param menu
         * @returns {boolean}
         */
        function isMenuActive(menu){
          $log.debug(menu);
          return $stateParams['itemId'] === getId(menu);
        }

        /**
         *
         */
        function getId(menuItem){
          return menuItem.meta[appConfig.itemIdKey];
        }


        /**
         *
         */
        function getMenuDisplay(menuItem){
          return Util.getPrettyLabel(menuItem.meta[appConfig.itemIdKey]);
        }


      }
    };
  });
