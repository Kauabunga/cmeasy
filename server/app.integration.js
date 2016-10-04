const expect = require('code').expect;
const mongoose = require('mongoose');

import app from './app';

describe('app', function () {

  it('should return a promise that resolves with a cmeasy instance', function (done) {
    app()
      .then(function (cmeasy) {
        expect(cmeasy).to.not.be.null();
        expect(cmeasy.getModel).to.be.a.function();
        done();
      })
  });
});
