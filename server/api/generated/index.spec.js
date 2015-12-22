'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var generatedCtrlStub = {
  index: 'generatedCtrl.index',
  show: 'generatedCtrl.show',
  create: 'generatedCtrl.create',
  update: 'generatedCtrl.update',
  destroy: 'generatedCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var generatedIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './generated.controller': generatedCtrlStub
});

/*
describe('Generated API Router:', function() {

  it('should return an express router instance', function() {
    generatedIndex.should.equal(routerStub);
  });

  describe('GET /api/generated', function() {

    it('should route to generated.controller.index', function() {
      routerStub.get
        .withArgs('/', 'generatedCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/generated/:id', function() {

    it('should route to generated.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'generatedCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/generated', function() {

    it('should route to generated.controller.create', function() {
      routerStub.post
        .withArgs('/', 'generatedCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/generated/:id', function() {

    it('should route to generated.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'generatedCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/generated/:id', function() {

    it('should route to generated.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'generatedCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/generated/:id', function() {

    it('should route to generated.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'generatedCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});

*/
