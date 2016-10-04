'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var generatedCtrlStub = {
  index: 'generatedCtrl.index',
  show: 'generatedCtrl.show',
  create: 'generatedCtrl.create',
  history: 'generatedCtrl.history',
  destroy: 'generatedCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  'delete': sinon.spy()
};

var formlyStub = {
  createModelFormlyFields: sinon.spy(),
  createModelColumns: sinon.spy()
};

var crudStub = {
  index: 'crudStub.index',
  show: 'crudStub.show',
  create: 'crudStub.create',
  history: 'crudStub.history',
  destroy: 'crudStub.destroy'
};

// require the index with our stubbed out modules
var generatedIndex = proxyquire('./index.js', {
  'express': {
    Router: function Router() {
      return routerStub;
    }
  },
  './generated.controller.crud': function generatedControllerCrud() {
    return generatedCtrlStub;
  }
})(crudStub, formlyStub);

describe.only('Generated API Router:', function () {

  it('should return an express router instance', function () {
    generatedIndex.should.equal(routerStub);
  });

  describe('GET /api/generated', function () {

    it('should route to generated.controller.index', function () {
      routerStub.get.withArgs('/', 'generatedCtrl.index').should.have.been.calledOnce;
    });
  });

  describe('GET /api/generated/:id', function () {

    it('should route to generated.controller.show', function () {
      routerStub.get.withArgs('/:id', 'generatedCtrl.show').should.have.been.calledOnce;
    });
  });

  describe('POST /api/generated', function () {

    it('should route to generated.controller.create', function () {
      routerStub.post.withArgs('/', 'generatedCtrl.create').should.have.been.calledOnce;
    });
  });

  describe('PUT /api/generated/:id', function () {

    it('should route to generated.controller.create', function () {
      routerStub.put.withArgs('/:id', 'generatedCtrl.create').should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/generated/:id', function () {

    it('should route to generated.controller.destroy', function () {
      routerStub['delete'].withArgs('/:id', 'generatedCtrl.destroy').should.have.been.calledOnce;
    });
  });
});
//# sourceMappingURL=index.spec.js.map
