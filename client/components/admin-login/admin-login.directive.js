'use strict';

angular.module('cmeasyApp')
  .directive('adminLogin', function (Auth, $state, $log, $timeout) {
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
          };
        }


        /**
         *
         */
        function login(user){

          $log.debug('logging in');

          scope.submitting = true;

          return Auth.login(user)
            .then(() => {
              // Logged in, redirect to home
              $state.go('admin.main');
              $timeout(() => {scope.submitting = false;}, 300);
            })
            .catch(err => {
              $log.debug('Error logging in', err);
              scope.submitting = false;
            });
        }


      }
    };
  });

