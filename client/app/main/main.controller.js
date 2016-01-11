

(function(angular) {

  'use strict';


  angular.module('cmeasyApp')
    .controller('MainController', function ($scope, $mdSidenav) {

      return init();

      function init() {
        $scope.openSidenav = openSidenav;
      }

      /**
       *
       */
      function openSidenav() {
        $mdSidenav('admin-left-nav').open();
      }

    });

})(angular);
