'use strict';

angular.module('cmeasyApp')
  .directive('adminLogin', function (Auth, $state, $log, $timeout, Analytics) {
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

              Analytics.trackEvent('Login', 'Successful');
              // Logged in, redirect to home
              $state.go('admin.content');
              $timeout(() => {scope.submitting = false;}, 300);
            })
            .catch(err => {
              Analytics.trackEvent('Login', 'Failed');

              $log.debug('Error logging in', err);
              scope.submitting = false;
            });
        }


      }
    };
  });

