

import flatten from './cmeasy.flatten.service';


describe('User Model', function() {

  it('should flatten the schema', function(){

    var flattenResult = flatten({
      test: {
        type: 'String'
      }
    });

  });

  it('should flatten the schema', function(){

    var flattenResult = flatten({
      testNested: {
        nestedValue: {
          type: 'String'
        }
      }
    });

    flattenResult['testNested.nestedValue'].type.should.equal('String');

  });


  it('should flatten the schema', function(){

    var flattenResult = flatten({
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
        default: 'mooo'
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
