'use strict';

import renderIndex from './components/render-index/index';
import auth from './auth/index';
import user from './api/user/index';
import _ from 'lodash';
import Promise from 'bluebird';
const debug = require('debug')(`cmeasy:routes:cmeasy`);

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
function routeContentRequest(cmeasy) {
  return (req, res, next) => {
    debug(`Routing content request ${req.params.type}, ${req.url}`);

    if (!req.params.type) {
      debug('Getting all content');
      return getAllContent(cmeasy)
        .then((indexes) => {
          return res.json(indexes);
          debug(`All content ${JSON.stringify(indexes)}`);
        })
        .catch((err) => {
          console.error('Error getting all content', err);
          return res.sendStatus(500);
        });
    }

    debug(`Return specific type: ${req.params.type}`);
    return getContentModel(cmeasy, req.params.type)
      .then((cmeasyModel) => {
        if (!cmeasyModel) {
          return res.sendStatus(404);
        }

        return cmeasyModel.getModelCrud()(req, res, next);
      });
  }
}

/**
 * TODO extend this so individual content pieces can be grabbed
 *
 * e.g. api/v1/content/homePage.js
 *
 * @param cmeasy
 */
function routeContentJsRequest(cmeasy) {

  //TODO configure this
  const prependJs = 'window._cmeasy_content = ';

  return (req, res, next) => {

    debug(`Routing content js request ${req.params.type} ${req.url}`);

    //Get all content as js
    return getAllContent(cmeasy)
      .then((indexes) => {
        debug(`All content as js ${JSON.stringify(indexes)}`);

        return res.status(200)
          .set('Cache-Control', 'no-cache, no-store, must-revalidate')
          .set('Pragma', 'no-cache')
          .set('Expires', 0)
          .set('Content-Type', 'application/javascript')
          .send(prependJs + JSON.stringify(indexes));
      })
      .catch((err) => {
        console.error('Error getting all content as js', err);
        return res.sendStatus(500);
      });

  }

}

function getContentModel(cmeasy, type) {
  return cmeasy.getSchemaController().index()
    .then(filterSchemaById(cmeasy, type))
    .then((schema) => {
      if (!schema) {
        return undefined;
      }

      const cmeasyModel = cmeasy.getModel(type);
      if (!cmeasyModel) {
        return cmeasy.createModel(schema);
      }

      return cmeasyModel;
    });
}

function getAllContent(cmeasy) {
  return cmeasy.getSchemaController().index()
    .then((schemas) => {
      return Promise.all(_(schemas)
        .map((schema) => {
          return [
            cmeasy.getModel(schema.meta[cmeasy.getIdKey()]),
            schema
          ];
        })
        .map(([model, schema]) => {
          if (!model) {
            return cmeasy.createModel(schema).getModelController().indexClean();
          }
          else {
            return model.getModelController().indexClean();
          }
        })
        .map((index) => {
          return index.then((indexResult) => {
            //TODO should probably handle singleton differently here
            if (indexResult.length > 0) {
              return {[indexResult[0][cmeasy.getIdKey()]]: indexResult};
            }

            return {};
          });
        })
        .value())
        .then((indexes) => {
          return _(indexes).reduce(_.merge);
        });
    });
}

function getCompleteSchemaList(cmeasy) {
  return (req, res, next) => {
    cmeasy.getSchemaController().index()
      .then((completeSchema) => {
        return res.status(200).json(completeSchema);
      })
      .catch((err) => {
        console.error('Error getting compelte schema list', err);
        return res.sendStatus(500);
      });
  }
}

function filterSchemaById(cmeasy, type) {
  return (schemas) => {
    return _(schemas).filter((schema) => {
      return schema.meta[cmeasy.getIdKey()] === type;
    })
      .first();
  }
}

function routeSchemaRequest(cmeasy) {
  return (req, res, next) => {
    debug(`Routing schema request ${req.url}`);
    return cmeasy.getSchemaCrud()(req, res, next);
  }
}

