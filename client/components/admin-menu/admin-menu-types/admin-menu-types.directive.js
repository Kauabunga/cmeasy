'use strict';

angular.module('cmeasyApp')
  .directive('adminMenuTypes', function ($rootScope, Admin, $log, $state, appConfig, $timeout) {
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
         */
        function getId(menuItem){
          return menuItem.meta[appConfig.itemIdKey];
        }


        /**
         *
         */
        function getMenuDisplay(menuItem){
          return getPrettyDisplay(menuItem.meta[appConfig.itemIdKey]);
        }


        /**
         *
         * @param id
         */
        function getPrettyDisplay(id){
          // insert a space before all caps
          return id.replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, function(str){ return str.toUpperCase(); });
        }


      }
    };
  });
