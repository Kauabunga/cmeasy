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
    login: 'admin.login',
    content: 'admin.content',
    users: 'admin.users',
    types: 'admin.types',
    type: 'admin.type',
    list: 'admin.list',
    item: 'admin.item'
  },
  adminLeftNavId: 'admin-left-nav'

};
//# sourceMappingURL=shared.js.map
