

'use strict';


import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';
import config from '../../config/environment';
import uuid from 'uuid';
import { minify } from 'html-minifier';
import ejs from 'ejs';


/**
 *
 */
export default function(app, cmeasy) {

  let indexDotHtml;

  return function renderIndexHtml(req, res, next){

    return Promise.all([getIndexAsString(), getInjectedVariables()])
      .then(function([ejsIndexTemplate, injectedVariables]){
        return res.header('content-type', 'text/html; charset=UTF-8')
          .end(ejsIndexTemplate(injectedVariables));
      })
      .catch(function(err){
        console.error('Error rendering index.html', err);
        return res.sendStatus(500);
      });

  };

  /**
   *
   */
  function getInjectedVariables(){

    return Promise.resolve({
      cmeasy: JSON.stringify({
        env: config.env,
        version: config.version,
        rootRoute: cmeasy.getRootRoute(),
        models: cmeasy.getModels()
      })
    });
  }

  /**
   *
   */
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

  /**
   *
   * @param template
   */
  function minifyTemplate(template){
    return minify(template, {
      minifyJS: true,
      minifyCSS: true,
      removeComments: true
    });
  }

  /**
   *
   */
  function getIndexFilePath(){
    return path.resolve(app.get('appPath') + '/index.template.html');
  }

}


