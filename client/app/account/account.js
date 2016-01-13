'use strict';

angular.module('cmeasyApp')
  .config(function($stateProvider) {

    $stateProvider
      .state('admin.logout', {
        url: '/logout?referrer',
        referrer: 'content',
        template: '',
        controller: function($state, Auth) {
          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'content';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('admin.signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('admin.settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });

  })
  .run(function($rootScope) {

    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });

  });
