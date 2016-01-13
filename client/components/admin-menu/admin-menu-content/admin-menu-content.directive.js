'use strict';

angular.module('cmeasyApp')
  .directive('adminMenuContent', function ($rootScope, Admin, $log, $state, appConfig, Util, $stateParams) {
    return {
      templateUrl: 'components/admin-menu/admin-menu-content/admin-menu-content.html',
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

          scope.isMenuActive = isMenuActive;
          scope.openMenu = openMenu;
          scope.getMenuDisplay = getMenuDisplay;
        }


        /**
         *
         */
        function openMenu($event, menuItem){

          let params = {
            itemType: getId(menuItem),
            itemId: getId(menuItem)
          };

          if(isSingleton(menuItem)){
            $state.transitionTo(appConfig.state.item, params);
          }
          else {
            $state.transitionTo(appConfig.state.list, params);
          }
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

        /**
         *
         */
        function isSingleton(menuItem){
          return menuItem.meta.singleton;
        }


        /**
         *
         * @param menu
         * @returns {boolean}
         */
        function isMenuActive(menu){
          return $stateParams['itemType'] === getId(menu);
        }


      }
    };
  });
