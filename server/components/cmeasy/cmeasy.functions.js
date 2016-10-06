const debug = require('debug')('cmeasy:functions');

module.exports = {
  getSchemaShowQuery: getSchemaShowQuery,
  getSchemaSortQuery: getSchemaSortQuery
}

function getSchemaShowQuery(id) {
  debug(`getSchemaShowQuery with id ${id}`);
  return {'meta._cmeasyId': id};
}

function getSchemaSortQuery() {
  debug(`getSchemaSortQuery`);
  return {'meta.dateCreated': -1};
}
