/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app, cmeasy) {

  // All undefined asset or api routes should return a 404
  app.route(`/:url(components|app|bower_components|assets)/*`).get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      return res.redirect(`/${cmeasy.getRootRoute()}`);
    });
}
