/**
 * Cmeasy application routes
 */

'use strict';

import renderIndex from './components/render-index/index';
import auth from './auth/index';
import user from './api/user/index';
import _ from 'lodash';
import Promise from 'bluebird';

/**
 *
 */
export default function(app, cmeasy) {

  app.use(`/${cmeasy.getRootRoute()}/auth`, auth);
  app.use(`/${cmeasy.getApiRoute()}/v1/users`, user);

  app.use(`/${cmeasy.getApiRoute()}/v1/content/schemacomplete`, getCompleteSchemaList(cmeasy));

  app.use(`/${cmeasy.getApiRoute()}/v1/content/schema`, routeSchemaRequest(cmeasy));
  app.use(`/${cmeasy.getApiRoute()}/v1/content/:type?`, routeContentRequest(cmeasy));

  app.use(`/${cmeasy.getRootRoute()}`, renderIndex(app, cmeasy));

}

/**
 *
 */
function routeContentRequest(cmeasy){
  return function(req, res, next){

    console.log('Routing content request', req.params.type, req.url);

    if(! req.params.type) {
      //Get all content
      //TODO move into cmeasy
      return cmeasy.getSchemaController().index()
        .then(function(schemas){
          return Promise.all(_(schemas)
            .map(function(schema){
              return [
                cmeasy.getModel(schema.meta[cmeasy.getIdKey()]),
                schema
              ];
            })
            .map(function([model, schema]){
              if(! model){
                return cmeasy.createModel(schema).getModelController().index();
              }
              else {
                return model.getModelController().index();
              }
            })
            .value())
            .then(function(indexes){
              return _(indexes).filter().value();
            });
        })
        .then(function (...indexes){
          console.log('All content', indexes);
          return res.json(indexes);
        })
        .catch(function(err){
          console.error('Error getting all content', err);
          return res.sendStatus(500);
        });
    }
    else {
      //Return specific content
      return cmeasy.getSchemaController().index()
        .then(filterSchemaById(cmeasy, req.params.type))
        .then(function(schema){
          if(! schema){
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
          if(cmeasyModel){
            return cmeasyModel.getModelCrud()(req, res, next);
          }
          else {
            return res.sendStatus(404);
          }
        });
    }
  }
}

/**
 *
 * @param cmeasy
 * @returns {Function}
 */
function getCompleteSchemaList(cmeasy){
  return function(req, res, next){
    cmeasy.getSchemaController().index()
      .then(function(completeSchema){
        return res.status(200).json(completeSchema);
      })
      .catch(function(err){
        console.error('Error getting compelte schema list', err);
        return res.sendStatus(500);
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

