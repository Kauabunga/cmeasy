'use strict';

(function() {

function UserResource($resource, appConfig) {
  return $resource(`${appConfig.usersRoute}/:id/:controller`, {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller:'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id:'me'
      }
    }
  });
}

angular.module('cmeasyApp.auth')
  .factory('User', UserResource);

})();
