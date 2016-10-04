const mongoose = require('mongoose');
const expect = require('chai').expect;

import app from './app';

describe('app', function () {

  it('should return a promise that resolves with a cmeasy instance', function (done) {
    app()
      .then(function (cmeasy) {
        expect(cmeasy).to.not.equal(null);
        expect(cmeasy.getModel).to.be.an('function');
        done();
      })
  });
});
