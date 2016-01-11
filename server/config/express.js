/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
var mongoStore = connectMongo(session);

/**
 *
 */
export default {
  coreExpress: coreExpress,
  staticExpress: staticExpress
}

/**
 *
 */
function coreExpress(app, cmeasy){
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with mongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      db: 'cmeasy'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  /* istanbul ignore if */
  if ('test' !== env) {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  /* istanbul ignore if */
  if ('development' === env) {
    try { app.use(require('connect-livereload')()); }
    catch(err) { console.error('Error loading connent-livereload module | app.env = ', env); }
  }
}

/**
 *
 * @param app
 */
function staticExpress(app, cmeasy){

  var env = app.get('env');

  app.set('appPath', path.join(config.root, 'client'));

  /* istanbul ignore if */
  if ('production' === env) {
    app.use(`/${cmeasy.getRootRoute()}`, favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(`/${cmeasy.getRootRoute()}`, express.static(app.get('appPath')));
    app.use(morgan('dev'));
  }


  if ('development' === env || 'test' === env) {

    app.use(`/${cmeasy.getRootRoute()}`, express.static(path.join(config.root, '.tmp')));
    app.use(`/${cmeasy.getRootRoute()}`, express.static(app.get('appPath')));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
