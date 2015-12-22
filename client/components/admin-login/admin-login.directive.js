'use strict';

angular.module('cmeasyApp')
  .directive('adminLogin', function (Auth, $state) {
    return {
      templateUrl: 'components/admin-login/admin-login.html',
      restrict: 'E',
      scope: {},
      link: function(scope, element) {

        return init();


        /**
         *
         */
        function init(){
          scope.login = login;
          scope.user = {
            email: 'admin@admin.com',
            password: 'admin'
          }
        }


        /**
         *
         */
        function login(user){
          return Auth.login(user)
            .then(() => {
              // Logged in, redirect to home
              $state.go('admin.main');
            })
            .catch(err => {
              //this.errors.other = err.message;
            });
        }


      }
    };
  });

