'use strict';

import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';
import config from '../../config';
import uuid from 'uuid';
import { minify } from 'html-minifier';
import ejs from 'ejs';

export default function(app, cmeasy) {

  let indexDotHtml;

  return function renderIndexHtml(req, res, next){

    var cspNonce = uuid.v4().replace(/-/g, '');

    return Promise.all([getIndexAsString(), getInjectedVariables(cspNonce, req)])
      .then(function([ejsIndexTemplate, injectedVariables]){
        return res.header('content-type', 'text/html; charset=UTF-8')
          .end(ejsIndexTemplate(injectedVariables));
      })
      .catch(function(err){
        console.error('Error rendering index.html', err);
        return res.sendStatus(500);
      });

  };

  function getInjectedVariables(cspNonce, req){
    return Promise.all([cmeasy.getSchemaController().index()])
      .then(function([models]){

        return {
          cmeasy: JSON.stringify({
            env: config.env,
            version: config.version,
            rootRoute: cmeasy.getRootRoute(),
            models: models
          }),
          requestPath: req.path,
          cspNonce: cspNonce,
          rootStaticRoute: cmeasy.getRootRoute() + '/'
          //rootStaticRoute: ''
        };

      });
  }

  function getIndexAsString(){
    if( ! indexDotHtml || config.env === 'development'){
      return new Promise((success, failure) => {
        return fs.readFile(getIndexFilePath(), 'utf8', function(err, indexTemplate){
          if(err){
            return failure(err);
          }
          else {
            return success(ejs.compile(minifyTemplate(indexTemplate), { rmWhitespace: true }));
          }
        });
      });
    }
    else {
      return Promise.resolve(indexDotHtml);
    }
  }

  function minifyTemplate(template){
    return minify(template, {
      minifyJS: true,
      minifyCSS: true,
      removeComments: true
    });
  }

  function getIndexFilePath(){
    return path.resolve(app.get('appPath') + '/index.template.html');
  }
}

