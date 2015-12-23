(function(angular, undefined) {
'use strict';

angular.module('cmeasyApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin'],modelFormlyRoute:'modelFormly',modelColumnRoute:'modelColumn',adminRoute:'admin',apiRoute:'/admin/api/v1/content',usersRoute:'/admin/api/v1/users',authRoute:'/admin/auth/local',itemIdKey:'_cmeasyId',itemInstanceKey:'_cmeasyInstanceId',state:{root:'admin',main:'admin.main',login:'admin.login',content:'admin.content',list:'admin.list',item:'admin.item'}})

;
})(angular);