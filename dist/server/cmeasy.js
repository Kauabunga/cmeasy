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

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

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

var _componentsCmeasyCmeasyFunctionsModels = require('./components/cmeasy/cmeasy.functions.models');

var _componentsCmeasyCmeasyControllerModel = require('./components/cmeasy/cmeasy.controller.model');

var _componentsCmeasyCmeasyControllerModel2 = _interopRequireDefault(_componentsCmeasyCmeasyControllerModel);

var _componentsCmeasyCmeasyControllerSchema = require('./components/cmeasy/cmeasy.controller.schema');

var _componentsCmeasyCmeasyControllerSchema2 = _interopRequireDefault(_componentsCmeasyCmeasyControllerSchema);

var _componentsCmeasyCmeasyControllerFormly = require('./components/cmeasy/cmeasy.controller.formly');

var _componentsCmeasyCmeasyControllerFormly2 = _interopRequireDefault(_componentsCmeasyCmeasyControllerFormly);

var _apiGeneratedIndex = require('./api/generated/index');

var _apiGeneratedIndex2 = _interopRequireDefault(_apiGeneratedIndex);

var _serverApiUserUserModel = require('../server/api/user/user.model');

var _serverApiUserUserModel2 = _interopRequireDefault(_serverApiUserUserModel);

var mongoose = require('mongoose');
mongoose.Promise = _bluebird2['default'];

var debug = require('debug')('cmeasy:cmeasy');

var CMEASY_ID = '_cmeasyId';
var CMEASY_INSTANCE_ID = '_cmeasyInstanceId';

var Cmeasy = (function () {
  function Cmeasy() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Cmeasy);
  }

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
        definition: this.getDefaultDefinition(model.definition || {})
      };
    }
  }, {
    key: 'getDefaultDefinition',
    value: function getDefaultDefinition(definition) {
      var index = 0;

      // Add a default order to the items
      (0, _lodash2['default'])(definition).map(function (definitionItem) {
        definitionItem.order = definitionItem.order || ++index * 10;
      }).value();

      return definition;
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
  }, {
    key: 'seedDatabase',
    value: function seedDatabase() {
      var _this = this;

      var debug = require('debug')('cmeasy:cmeasy:seedDatabase');
      var localOptions = this.getOptions().options;
      debug('Seeding database');
      if (!localOptions.initialUsers) {
        debug('options.initialUsers is null or undefined, using defaults');
        localOptions.initialUsers = {
          clean: true,
          data: [{
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
          }, {
            name: 'Admin',
            role: 'admin',
            email: 'admin@admin.com',
            password: 'admin'
          }]
        };
      }

      var seedActions = _bluebird2['default'].resolve();
      if (localOptions.initialUsers.clean) {
        debug('Erasing all users from db');
        seedActions = _serverApiUserUserModel2['default'].find({}).remove();
      }

      seedActions = seedActions.then(function () {
        return _serverApiUserUserModel2['default'].create(localOptions.initialUsers.data);
      })['catch'](function (error) {
        debug('Seed database failed');
        console.error(error);
        process.exit(1);
      });

      if (!_ramda2['default'].isNil(localOptions.models)) {
        (function () {
          debug('Checking for model initialData');

          var modelsToSeed = _ramda2['default'].filter(function (model) {
            return model.initialData;
          })(localOptions.models);

          if (!_ramda2['default'].isNil(modelsToSeed)) {
            debug('Models with initialData: ' + modelsToSeed.length);
            seedActions = seedActions.then(function () {
              return _this.createInitialModelData(modelsToSeed);
            });
          }
        })();
      }

      return seedActions;
    }
  }, {
    key: 'createInitialModelData',
    value: function createInitialModelData(modelsToSeed) {
      var _this2 = this;

      return _bluebird2['default'].all(modelsToSeed.map(function (modelDefinition) {
        var cmeasyModelName = modelDefinition.definition._cmeasyId['default'];
        var modelDefinitionData = modelDefinition.initialData.data;

        debug('Enforcing initialData for: ' + cmeasyModelName);

        var modelActions = _bluebird2['default'].resolve();
        var cmeasyModel = _this2.getModel(cmeasyModelName);
        var mongooseModel = cmeasyModel.getModel();

        // Erase all current model data
        if (modelDefinition.initialData.clean) {
          debug(cmeasyModelName + ' has "clean" set, clearing all current model data');
          modelActions = modelActions.then(function () {
            return cmeasyModel.getModel().find({}).remove();
          });
        }

        // Check for instances with matching properties & do not update them if present
        debug(cmeasyModelName + ' checking for instances with properties matching "initialData.data"');
        modelActions = modelActions.then(function () {
          return mongooseModel.find({
            $or: modelDefinition.initialData.data
          });
        }).then(function (modelInstances) {
          debug(cmeasyModelName + ' found ' + modelInstances.length + ' matching instances against definition data');

          return _bluebird2['default'].all(_ramda2['default'].map(function (modelDefinitionDataItem) {
            debug(cmeasyModelName + ' checking for presence of ' + JSON.stringify(modelDefinitionDataItem));

            // Determine whether one of the returned instances matches the modelDefinition
            var matchingInstance = _ramda2['default'].find(function (modelInstance) {
              var propertyComparison = _ramda2['default'].map(function (modelDefinitionPair) {
                return _ramda2['default'].propEq.apply(_ramda2['default'], modelDefinitionPair);
              })(_ramda2['default'].toPairs(modelDefinitionDataItem));
              return _ramda2['default'].allPass(propertyComparison)(modelInstance);
            })(modelInstances);

            if (!matchingInstance) {
              debug(cmeasyModelName + ' no instance found, creating');
              return (0, _componentsCmeasyCmeasyFunctionsModels.createInstance)(_this2, cmeasyModel, modelDefinitionDataItem);
            } else {
              debug(cmeasyModelName + ' instance found, ignoring');
              return _bluebird2['default'].resolve();
            }
          })(modelDefinitionData));
        });

        return modelActions;
      }));
    }
  }], [{
    key: 'create',
    value: function create(options) {
      var instance = new Cmeasy(options);
      debug('Initialising');
      instance.name = options.name || 'Cmeasy';
      instance.options = new CmeasyOptions(options);
      instance.models = [];

      instance._schema = (0, _componentsCmeasyCmeasySchema2['default'])(instance.getNamespace(), instance.getMongoose(), instance);
      instance._schemaController = (0, _componentsCmeasyCmeasyControllerSchema2['default'])(instance);
      instance._schemaFormly = (0, _componentsCmeasyCmeasyControllerFormly2['default'])(instance.getSchemaMetaId(), instance.getSchemaController());
      instance._schemaCrud = (0, _apiGeneratedIndex2['default'])(instance.getSchemaController(), instance.getSchemaFormly());

      debug('Generating models');
      return _bluebird2['default'].all(instance.generateModels(options.models)).then(function () {
        return instance.seedDatabase();
      }).then(function () {
        debug('Initialisation complete');
        return instance;
      });
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
  }

  _createClass(CmeasyOptions, [{
    key: 'connectToMongo',
    value: function connectToMongo() {
      if (!mongoose.connection.readyState) {
        mongoose.connect(_configEnvironmentIndex2['default'].mongo.uri, _configEnvironmentIndex2['default'].mongo.options);
        mongoose.connection.on('error', function (err) {
          console.error('MongoDB connection error: ' + err);
          process.exit(-1);
        });
      }
    }
  }, {
    key: 'getMongoose',
    value: function getMongoose() {
      return this.options.mongoose || mongoose;
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
  }, {
    key: 'getUserModel',
    value: function getUserModel() {
      return _serverApiUserUserModel2['default'];
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
    this._modelController = (0, _componentsCmeasyCmeasyControllerModel2['default'])(this, cmeasy);
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
