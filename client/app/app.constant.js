(function(angular, undefined) {
'use strict';

angular.module('cmeasyApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin'],modelFormlyRoute:'modelFormly',modelColumnRoute:'modelColumn',adminRoute:'admin',apiRoute:'/admin/api/v1/content',usersRoute:'/admin/api/v1/users',authRoute:'/admin/auth/local',itemIdKey:'_cmeasyId',itemInstanceKey:'_cmeasyInstanceId',state:{root:'admin',login:'admin.login',content:'admin.content',users:'admin.users',types:'admin.types',type:'admin.type',list:'admin.list',item:'admin.item'},adminLeftNavId:'admin-left-nav'})

;
})(angular);