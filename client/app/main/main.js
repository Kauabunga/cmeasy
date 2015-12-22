'use strict';

angular.module('cmeasyApp')
  .config(function($stateProvider) {

    $stateProvider
      .state('admin.main', {
        url: '/main',
        authenticate: true,
        menuIndex: 1,
        views: {
          admincontent: {
            template: '<h1>Main state</h1>'
          }
        }
      });

    $stateProvider
      .state('admin.content', {
        url: '/content',
        authenticate: true,
        menuIndex: 2,
        views: {
          admincontent: {
            template: '<h1>Content state</h1>'
          }
        }
      });

    $stateProvider
      .state('admin.list', {
        url: '/list/:itemType',
        authenticate: true,
        menuIndex: 2,
        views: {
          admincontent: {
            template: '<admin-list list-type-param="itemType"></admin-list>'
          }
        }
      });

    $stateProvider
      .state('admin.item', {
        url: '/item/:itemType/:itemId',
        authenticate: true,
        menuIndex: 2,
        views: {
          admincontent: {
            template: '<admin-item item-type-param="itemType" item-id-param="itemId"></admin-item>'
          }
        }
      });

    $stateProvider
      .state('admin.login', {
        url: '/login',
        authenticate: false,
        menuIndex: 0,
        views: {
          admincontent: {
            template: '<h1>Login state</h1>'
          }
        }
      })

  });
