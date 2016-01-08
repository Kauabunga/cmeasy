'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _cmeasyFlattenService = require('./cmeasy.flatten.service');

var _cmeasyFlattenService2 = _interopRequireDefault(_cmeasyFlattenService);

describe('User Model', function () {

  it('should flatten the schema', function () {

    var flattenResult = (0, _cmeasyFlattenService2['default'])({
      test: {
        type: 'String'
      }
    });
  });

  it('should flatten the schema', function () {

    var flattenResult = (0, _cmeasyFlattenService2['default'])({
      testNested: {
        nestedValue: {
          type: 'String'
        }
      }
    });

    flattenResult['testNested.nestedValue'].type.should.equal('String');
  });

  it('should flatten the schema', function () {

    var flattenResult = (0, _cmeasyFlattenService2['default'])({
      testNested: {
        nestedValue: {
          type: 'String'
        },
        secondNestedValue: {
          type: 'String'
        }
      },
      single: {
        type: 'String',
        displayColumn: true,
        disableEdit: true,
        'default': 'mooo'
      },
      testArray: {
        type: [{
          moo: {
            type: 'String'
          }
        }]
      }
    });

    flattenResult['testNested.nestedValue'].type.should.equal('String');
    flattenResult.single.type.should.equal('String');
  });
});
//# sourceMappingURL=cmeasy.flatten.service.spec.js.map
