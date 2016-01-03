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

  app.use(`/${cmeasy.getApiRoute()}/v1/content/schema`, routeSchemaRequest(cmeasy));
  app.use(`/${cmeasy.getApiRoute()}/v1/content/:type`, routeContentRequest(cmeasy));

  app.use(`/${cmeasy.getRootRoute()}`, renderIndex(app, cmeasy));

}

/**
 *
 */
function routeContentRequest(cmeasy){
  return function(req, res, next){

    console.log('Routing content request', req.url);

    if(! req.params.type) { return res.sendStatus(401); }

    return cmeasy.getSchemaController().index()
      .then(filterSchemaById(cmeasy, req.params.type))
      .then(function(schema){
        if(! schema){
          res.sendStatus(404);
          return undefined;
        }
        else {
          var cmeasyModel = cmeasy.getModel(req.params.type);

          if( ! cmeasyModel ){
            return cmeasy.createModel(schema);
          }
          else {
            return cmeasyModel;
          }
        }
      })
      .then(function(cmeasyModel){


        console.log(cmeasyModel);

        return cmeasyModel.getModelCrud()(req, res, next);
      })
      .catch(function(err){
        console.error('Error routing content request', err);
        return next();
      });
  }
}



/**
 *
 * @param type
 * @returns {Function}
 */
function filterSchemaById(cmeasy, type){
  return function(schemas){
    return _(schemas).filter(function(schema){
      return schema.meta[cmeasy.getIdKey()] === type;
    }).first();
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

