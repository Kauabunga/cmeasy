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
  app.use(`/${cmeasy.getApiRoute()}/v1/content.js`, routeContentJsRequest(cmeasy));

  app.use(`/${cmeasy.getRootRoute()}`, renderIndex(app, cmeasy));

}

/**
 * TODO ensure that the connection to the database has been achieved before resolving any of these flows
 */
function routeContentRequest(cmeasy){
  return function(req, res, next){

    console.log('Routing content request', req.params.type, req.url);

    if( ! req.params.type ) {

      //Get all content
      return getAllContent(cmeasy)
        .then(function (indexes){
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
      return getContentModel(cmeasy, req.params.type)
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
 * TODO extend this so individual content pieces can be grabbed
 *
 * e.g. api/v1/content/homePage.js
 *
 * @param cmeasy
 */
function routeContentJsRequest(cmeasy){

  //TODO configure this
  const prependJs = 'window._cmeasy_content = ';

  return function(req, res, next) {

    console.log('Routing content js request', req.params.type, req.url);

    //Get all content as js
    return getAllContent(cmeasy)
      .then(function (indexes) {
        console.log('All content as js', indexes);

        return res.status(200)
          .set('Cache-Control', 'no-cache, no-store, must-revalidate')
          .set('Pragma', 'no-cache')
          .set('Expires', 0)
          .set('Content-Type', 'application/javascript')
          .send(prependJs + JSON.stringify(indexes));
      })
      .catch(function (err) {
        console.error('Error getting all content as js', err);
        return res.sendStatus(500);
      });

  }

}

/**
 *
 * @param cmeasy
 * @param type
 * @returns {*}
 */
function getContentModel(cmeasy, type){
  return cmeasy.getSchemaController().index()
    .then(filterSchemaById(cmeasy, type))
    .then(function(schema){
      if(! schema){
        return undefined;
      }
      else {
        var cmeasyModel = cmeasy.getModel(type);
        if( ! cmeasyModel ){
          return cmeasy.createModel(schema);
        }
        else {
          return cmeasyModel;
        }
      }
    });
}

/**
 *
 * @param cmeasy
 * @returns {*}
 */
function getAllContent(cmeasy){
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
            return cmeasy.createModel(schema).getModelController().indexClean();
          }
          else {
            return model.getModelController().indexClean();
          }
        })
        .map(function(index){
          return index.then(function(indexResult){
            //TODO should probably handle singleton differently here
            if(indexResult.length > 0){
              return {[indexResult[0][cmeasy.getIdKey()]]: indexResult };
            }
            else {
              return {};
            }
          });
        })
        .value())
        .then(function(indexes){
          return _(indexes).reduce(_.merge);
        });
    });
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

