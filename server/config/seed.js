/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import User from '../api/user/user.model';

export default function(){

  return User.find({}).removeAsync()
    .then(() => {
      return User.createAsync({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin'
      })
        .then((users) => {
          console.log('finished populating users');
          return users;
        });
    });

}
