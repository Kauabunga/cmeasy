/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

const debug = require('debug')('cmeasy:config:seed');
import User from '../api/user/user.model';

export default function() {
  debug('Populating users');
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
          debug('Finished populating users');
          return users;
        });
    });
}
