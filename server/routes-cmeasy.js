/**
 * Cmeasy application routes
 */

'use strict';

import renderIndex from './components/render-index';
import auth from './auth';
import user from './api/user';
import generated from './api/generated';
import _ from 'lodash';

/**
 *
 */
export default function(app, cmeasy) {

  //TODO create get all content endpoint. route via config

  _(cmeasy.getModels()).map(createContentRoute(app, cmeasy)).value();
  app.use(`/${cmeasy.getRootRoute()}/api/v1/users`, user);
  app.use(`/${cmeasy.getRootRoute()}/auth`, auth);
  app.use(`/${cmeasy.getRootRoute()}`, renderIndex(app, cmeasy));

}

/**
 *
 */
function createContentRoute(app, cmeasy){
  return function(model){
    //TODO make use of this namespace
    let routeName = getRoute(cmeasy.getRootRoute(), model);
    console.info('Creating route', routeName);
    return app.use(routeName, generated(model));

  }
}

/**
 *
 */
function getRoute(route, model){
  return `/${route}/api/v1/${getRouteFromModel(model)}`;
}

/**
 *
 */
function getRouteFromModel(model){
  return _.camelCase(model.name.toString());
}
