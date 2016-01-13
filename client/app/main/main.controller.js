

(function(angular) {

  'use strict';


  angular.module('cmeasyApp')
    .controller('MainController', function ($scope, $mdSidenav, appConfig) {

      return init();

      function init() {
        $scope.openSidenav = openSidenav;
      }

      /**
       *
       */
      function openSidenav() {
        $mdSidenav(appConfig.adminLeftNavId).open();
      }

    });

})(angular);
