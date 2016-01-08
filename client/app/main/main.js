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
            template: '<div><admin-title title="Dashboard"></admin-title><admin-api-display></admin-api-display></div>'
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
            template: '<div><admin-title title="Content"></admin-title></div>'
          }
        }
      });

    $stateProvider
      .state('admin.types', {
        url: '/types/:itemType',
        authenticate: true,
        menuIndex: 3,
        views: {
          admincontent: {
            template: '<admin-list list-type-param="itemType" item-state="admin.type"></admin-list>'
          }
        }
      });

    $stateProvider
      .state('admin.type', {
        url: '/type/:itemType/:itemId',
        authenticate: true,
        menuIndex: 3,
        views: {
          admincontent: {
            template: '<admin-item item-type-param="itemType" item-id-param="itemId"></admin-item>'
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

    //TODO if this is not a singleton then we should change menu states
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
            template: '<admin-title title=""></admin-title><cmeasy-home-page></cmeasy-home-page>'
          }
        }
      });

  });
