/**
 * Cmeasy
 */

'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _configEnvironmentIndex = require('./config/environment/index');

var _configEnvironmentIndex2 = _interopRequireDefault(_configEnvironmentIndex);

var _componentsCmeasyCmeasyModel = require('./components/cmeasy/cmeasy.model');

var _componentsCmeasyCmeasyModel2 = _interopRequireDefault(_componentsCmeasyCmeasyModel);

var _componentsCmeasyCmeasySchema = require('./components/cmeasy/cmeasy.schema');

var _componentsCmeasyCmeasySchema2 = _interopRequireDefault(_componentsCmeasyCmeasySchema);

var _componentsCmeasyCmeasyControllerModel = require('./components/cmeasy/cmeasy.controller.model');

var _componentsCmeasyCmeasyControllerModel2 = _interopRequireDefault(_componentsCmeasyCmeasyControllerModel);

var _componentsCmeasyCmeasyControllerSchema = require('./components/cmeasy/cmeasy.controller.schema');

var _componentsCmeasyCmeasyControllerSchema2 = _interopRequireDefault(_componentsCmeasyCmeasyControllerSchema);

var _componentsCmeasyCmeasyControllerFormly = require('./components/cmeasy/cmeasy.controller.formly');

var _componentsCmeasyCmeasyControllerFormly2 = _interopRequireDefault(_componentsCmeasyCmeasyControllerFormly);

var _apiGeneratedIndex = require('./api/generated/index');

var _apiGeneratedIndex2 = _interopRequireDefault(_apiGeneratedIndex);

var mongoose = _bluebird2['default'].promisifyAll(require('mongoose'));
mongoose.Promise = _bluebird2['default'];

var CMEASY_ID = '_cmeasyId';
var CMEASY_INSTANCE_ID = '_cmeasyInstanceId';

/**
 *
 */

var Cmeasy = (function () {
  function Cmeasy() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Cmeasy);

    this.name = options.name || 'Cmeasy';
    this.options = new CmeasyOptions(options);
    this.models = [];

    this._schema = (0, _componentsCmeasyCmeasySchema2['default'])(this.getNamespace(), this.getMongoose(), this);
    this._schemaController = (0, _componentsCmeasyCmeasyControllerSchema2['default'])(this);
    this._schemaFormly = (0, _componentsCmeasyCmeasyControllerFormly2['default'])(this.getSchemaMetaId(), this.getSchemaController());
    this._schemaCrud = (0, _apiGeneratedIndex2['default'])(this.getSchemaController(), this.getSchemaFormly());

    return _bluebird2['default'].all(this.generateModels(options.models)).then(function (models) {
      return _this;
    });
  }

  /**
   * TODO
   */

  _createClass(Cmeasy, [{
    key: 'generateModels',
    value: function generateModels(models) {
      return (0, _lodash2['default'])(models).map(this.initModel.bind(this)).value();
    }
  }, {
    key: 'initModel',
    value: function initModel(model) {
      return this.getSchemaController().create(this.getModelSchema(model)).then(this.getAsObject.bind(this)).then(this.createModel.bind(this))['catch'](function (error) {
        console.error('error', error);
      });
    }
  }, {
    key: 'createModel',
    value: function createModel(model) {
      var existingModel = this.getModel(model.meta._cmeasyId);
      if (existingModel) {
        return existingModel;
      } else {
        var newModel = new CmeasyModel(this, model);
        this.models.push(newModel);
        return newModel;
      }
    }
  }, {
    key: 'getAsObject',
    value: function getAsObject(obj) {
      return obj.toObject();
    }
  }, {
    key: 'getModelSchema',
    value: function getModelSchema(model) {
      var _meta;

      return {
        meta: (_meta = {}, _defineProperty(_meta, this.getIdKey(), _lodash2['default'].camelCase(model.name)), _defineProperty(_meta, 'author', 'Cmeasy User'), _defineProperty(_meta, 'comment', 'Cmeasy init'), _defineProperty(_meta, 'singleton', model.singleton || false), _defineProperty(_meta, 'disableDelete', model.disableDelete || false), _defineProperty(_meta, 'disableCreate', model.disableCreate || false), _meta),
        definition: model.definition || {}
      };
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.options;
    }
  }, {
    key: 'getModels',
    value: function getModels() {
      return this.models;
    }
  }, {
    key: 'getModel',
    value: function getModel(id) {
      return (0, _lodash2['default'])(this.models).filter(function (model) {
        return model.getId() === id;
      }).first();
    }
  }, {
    key: 'getNamespace',
    value: function getNamespace() {
      return this.name;
    }
  }, {
    key: 'getMongoose',
    value: function getMongoose() {
      return this.getOptions().getMongoose();
    }
  }, {
    key: 'getExpress',
    value: function getExpress() {
      return this.getOptions().getExpress();
    }
  }, {
    key: 'getRootRoute',
    value: function getRootRoute() {
      return this.getOptions().getRootRoute();
    }
  }, {
    key: 'getApiRoute',
    value: function getApiRoute() {
      return this.getRootRoute() + '/api';
    }
  }, {
    key: 'getSchema',
    value: function getSchema() {
      return this._schema;
    }
  }, {
    key: 'getSchemaController',
    value: function getSchemaController() {
      return this._schemaController;
    }
  }, {
    key: 'getSchemaMetaId',
    value: function getSchemaMetaId() {
      return 'CmeasyMetaSchema';
    }
  }, {
    key: 'getSchemaCrud',
    value: function getSchemaCrud() {
      return this._schemaCrud;
    }
  }, {
    key: 'getSchemaFormly',
    value: function getSchemaFormly() {
      return this._schemaFormly;
    }
  }, {
    key: 'getIdKey',
    value: function getIdKey() {
      return CMEASY_ID;
    }
  }, {
    key: 'getInstanceKey',
    value: function getInstanceKey() {
      return CMEASY_INSTANCE_ID;
    }
  }]);

  return Cmeasy;
})();

exports['default'] = Cmeasy;

var CmeasyOptions = (function () {
  function CmeasyOptions(options) {
    _classCallCheck(this, CmeasyOptions);

    this.options = options;

    if (!this.isUserDefinedMongoose()) {
      this.connectToMongo();
    }
    if (!this.isUserDefinedEnvironment()) {
      this.options.environment = 'production';
    }

    this.seedMongo();
  }

  /**
   *
   */

  //TODO config urls

  _createClass(CmeasyOptions, [{
    key: 'connectToMongo',
    value: function connectToMongo() {
      var mongoose = this.getMongoose();
      mongoose.connect(_configEnvironmentIndex2['default'].mongo.uri, _configEnvironmentIndex2['default'].mongo.options);
      mongoose.connection.on('error', function (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
      });
    }

    //TODO always seed - i.e. fix tests to handle initial seed
  }, {
    key: 'seedMongo',
    value: function seedMongo() {
      if (_configEnvironmentIndex2['default'].seedDB) {
        require('./config/seed')();
      }
    }
  }, {
    key: 'getMongoose',
    value: function getMongoose() {
      return this.options.mongoose && _bluebird2['default'].promisifyAll(this.options.mongoose) || _bluebird2['default'].promisifyAll(mongoose);
    }
  }, {
    key: 'isUserDefinedEnvironment',
    value: function isUserDefinedEnvironment() {
      return !!this.options.environment;
    }
  }, {
    key: 'isUserDefinedMongoose',
    value: function isUserDefinedMongoose() {
      return !!this.options.mongoose;
    }
  }, {
    key: 'isUserDefinedExpressApp',
    value: function isUserDefinedExpressApp() {
      return !!this.options.express;
    }
  }, {
    key: 'getExpress',
    value: function getExpress() {
      return this.options.express || _express2['default'];
    }
  }, {
    key: 'getRootRoute',
    value: function getRootRoute() {
      return this.options.rootRoute || 'admin';
    }
  }]);

  return CmeasyOptions;
})();

var CmeasyModel = (function () {
  function CmeasyModel(cmeasy, model) {
    _classCallCheck(this, CmeasyModel);

    this.meta = model.meta;
    this.definition = model.definition;

    this.cmeasy = cmeasy;

    this._model = (0, _componentsCmeasyCmeasyModel2['default'])(cmeasy, cmeasy.getMongoose(), this);
    this._modelController = (0, _componentsCmeasyCmeasyControllerModel2['default'])(this, cmeasy.getSchemaController());
    this._modelFormly = (0, _componentsCmeasyCmeasyControllerFormly2['default'])(this.getId(), cmeasy.getSchemaController());
    this._modelCrud = (0, _apiGeneratedIndex2['default'])(this.getModelController(), this.getModelFormly());
  }

  _createClass(CmeasyModel, [{
    key: 'getModel',
    value: function getModel() {
      return this._model;
    }
  }, {
    key: 'getModelFormly',
    value: function getModelFormly() {
      return this._modelFormly;
    }
  }, {
    key: 'getModelController',
    value: function getModelController() {
      return this._modelController;
    }
  }, {
    key: 'getModelCrud',
    value: function getModelCrud() {
      return this._modelCrud;
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.meta._cmeasyId;
    }
  }, {
    key: 'getIdKey',
    value: function getIdKey() {
      return CMEASY_ID;
    }
  }, {
    key: 'getInstanceKey',
    value: function getInstanceKey() {
      return CMEASY_INSTANCE_ID;
    }
  }]);

  return CmeasyModel;
})();

module.exports = exports['default'];
//# sourceMappingURL=cmeasy.js.map
