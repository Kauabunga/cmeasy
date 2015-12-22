/**
 * Cmeasy application routes
 */

'use strict';

import renderIndex from './components/render-index';
import auth from './auth';
import user from './api/user';
import _ from 'lodash';

/**
 *
 */
export default function(app, cmeasy) {

  app.use(`/${cmeasy.getRootRoute()}/auth`, auth);
  app.use(`/${cmeasy.getApiRoute()}/v1/users`, user);
  app.use(`/${cmeasy.getApiRoute()}/v1/content/:type`, routeContentRequest(cmeasy));


  //TODO crud on the models/schemas themselves
  //app.use(`/${cmeasy.getApiRoute()}/v1/createcontent/:type`, routeContentRequest(cmeasy));
  //app.use(`/${cmeasy.getApiRoute()}/v1/updatecontent/:type`, routeContentRequest(cmeasy));
  //app.use(`/${cmeasy.getApiRoute()}/v1/deletecontent/:type`, routeContentRequest(cmeasy));


  app.use(`/${cmeasy.getRootRoute()}`, renderIndex(app, cmeasy));

}

/**
 *
 */
function routeContentRequest(cmeasy){
  return function(req, res, next){
    //get content type from req
    return cmeasy.getModel(req.params.type).getCrud()(req, res, next);
  }
}
