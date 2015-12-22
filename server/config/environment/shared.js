'use strict';

exports = module.exports = {

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  modelFormlyRoute: 'modelFormly',
  modelColumnRoute: 'modelColumn',


  //TODO should move to non-generated appConfig (or extend appConfig)
  adminRoute: 'admin',
  apiRoute: '/admin/api/v1',
  authRoute: '/admin/auth/local',
  itemIdKey: '_cmeasyId',
  state: {
    root: 'admin',
    main: 'admin.main',
    login: 'admin.login',
    content: 'admin.content',
    list: 'admin.list',
    item: 'admin.item'
  }

};
