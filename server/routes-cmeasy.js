/**
 * Cmeasy application routes
 */

'use strict';

import renderIndex from './components/render-index/index';
import auth from './auth/index';
import user from './api/user/index';
import _ from 'lodash';

/**
 *
 */
export default function(app, cmeasy) {

  app.use(`/${cmeasy.getRootRoute()}/auth`, auth);
  app.use(`/${cmeasy.getApiRoute()}/v1/users`, user);

  app.use(`/${cmeasy.getApiRoute()}/v1/content/:type`, routeContentRequest(cmeasy));
  //app.use(`/${cmeasy.getApiRoute()}/v1/schema/:type`, routeSchemaRequest(cmeasy));
  app.use(`/${cmeasy.getApiRoute()}/v1/schema`, routeSchemaRequest(cmeasy));

  app.use(`/${cmeasy.getRootRoute()}`, renderIndex(app, cmeasy));

}

/**
 *
 */
function routeContentRequest(cmeasy){
  return function(req, res, next){

    console.log('Routing content request', req.url);

    if(! req.params.type) {return res.sendStatus(401);}
    if(! cmeasy.getModel(req.params.type)) {return res.sendStatus(404);}

    //get content type from req
    return cmeasy.getModel(req.params.type).getModelCrud()(req, res, next);
  }
}

/**
 *
 */
function routeSchemaRequest(cmeasy){
  return function(req, res, next){

    console.log('Routing schema request', req.url);

    //get content type from req
    return cmeasy.getSchemaCrud()(req, res, next);
  }
}
