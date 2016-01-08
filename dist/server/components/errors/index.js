/**
 * Error responses
 */

'use strict';

//TODO handle 500 pretty print

module.exports = {
  404: pageNotFound
};

/**
 *
 * @param req
 * @param res
 * @returns {*}
 */
function pageNotFound(req, res) {

  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  res.status(result.status);
  return res.render(viewFilePath, {}, function (err, html) {

    if (err) {
      return res.json(result, result.status);
    }

    return res.send(html);
  });
}
//# sourceMappingURL=index.js.map
