'use strict';

angular.module('cmeasyApp')
  .directive('adminMenuTypes', function ($rootScope, Admin, $log, $state, appConfig) {
    return {
      templateUrl: 'components/admin-menu/admin-menu-types/admin-menu-types.html',
      restrict: 'E',
      scope: {},
      link: function(scope, element) {

        return init();

        /**
         *
         */
        function init(){

          scope.openMenu = openMenu;

          return Admin.getModels()
            .then(function(models){
              scope.menuItems = _(models).map(getMenuItem).value();
            });
        }

        /**
         *
         * @param model
         */
        function getMenuItem(model){
          return model;
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
          return menuItem._cmeasyId;
        }

      }
    };
  });
