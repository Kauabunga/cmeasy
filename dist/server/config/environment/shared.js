'use strict';

exports = module.exports = {

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  modelFormlyRoute: 'modelFormly',
  modelColumnRoute: 'modelColumn',

  //TODO should move to non-generated appConfig (or extend appConfig)
  adminRoute: 'admin',
  apiRoute: '/admin/api/v1/content',
  usersRoute: '/admin/api/v1/users',
  authRoute: '/admin/auth/local',
  itemIdKey: '_cmeasyId',
  itemInstanceKey: '_cmeasyInstanceId',
  state: {
    root: 'admin',
    main: 'admin.main',
    login: 'admin.login',
    content: 'admin.content',
    types: 'admin.types',
    type: 'admin.type',
    list: 'admin.list',
    item: 'admin.item'
  }

};
//# sourceMappingURL=shared.js.map
