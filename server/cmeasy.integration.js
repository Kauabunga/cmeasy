const expect = require('chai').expect;
import Cmeasy from './cmeasy';
import R from 'ramda';

describe('cmeasy', function() {

  let cmeasy;
  const data = [
    {
      title: 'First title',
      content: '(╯°□°）╯︵ ┻━┻'
    },
    {
      title: 'Second title',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ille pellit, qui permulcet sensum voluptate. Sed virtutem ipsam inchoavit, nihil amplius. Sed quod proximum fuit non vidit. Sint modo partes vitae beatae. Miserum hominem! Si dolor summum malum est, dici aliter non potest. Nihil enim iam habes, quod ad corpus referas; Duo Reges: constructio interrete. Inscite autem medicinae et gubernationis ultimum cum ultimo sapientiae comparatur.'
    }
  ];

  beforeEach((done) => {
    Cmeasy.create({
      models: [
        {
          name: 'Test Schema',
          definition: {
            title: {
              type: 'String'
            },
            content: {
              type: 'String'
            }
          },
          initialData: {
            clean: true,
            data: data
          }
        }
      ]
    })
      .then((_cmeasy_) => {
        cmeasy = _cmeasy_
        done();
      });
  });

  it('should create one and one only instance of each item in a model\'s initial data', function(done) {
    cmeasy.getModel('testSchema')
      .getModel()
      .find({})
      .then((testSchemas) => {
        const testSchemaObjects = R.map((testSchema) => testSchema.toObject())(testSchemas);
        expect(testSchemaObjects.length)
          .to
          .equal(2);

        // Verify that the response contains both initial data items
        const ensureDatumPresent = (datum) => {
          return Boolean(R.find(R.where({
            title: R.equals(datum.title),
            content: R.equals(datum.content)
          }))(testSchemaObjects));
        }

        const firstDatum = R.nth(1, data);
        expect(ensureDatumPresent(firstDatum, firstDatum.title))
          .to
          .equal(true);
        const secondDatum = R.nth(1, data);
        expect(ensureDatumPresent(secondDatum, secondDatum.title))
          .to
          .equal(true);

        done();
      });
  });
});
