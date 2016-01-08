

(function(angular) {

  'use strict';


  angular.module('cmeasyApp')
    .controller('MainController', function ($scope, $mdSidenav) {

      return init();

      function init() {
        $scope.openSidenav = openSidenav;

        console.log('ajhsdfjkdfhshafjkskhjfds');
      }


      /**
       *
       */
      function openSidenav() {
        $mdSidenav('admin-left-nav').open();
      }

    });


})(angular);
