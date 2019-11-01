import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/sections/preview-client-application-types.njk' import previewClientApplicationTypes %}
                            {{ previewClientApplicationTypes(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-client-application-types', () => {
  it('should render the title of the section', (done) => {
    const context = {
      section: {},
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h3').text().trim()).toEqual('Client application type');

        done();
      });
  });

  it('should not render the client-application-types section when not provided', (done) => {
    const context = {
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-client-application-types"]').length).toEqual(0);

        done();
      });
  });

  describe('when a sub section exists for an application type', () => {
    it('should render the browsed based application type', (done) => {
      const context = {
        section: {
          sections: {
            'browser-based': {},
          },
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);


          const browserBasedExpandableSection = $('[data-test-id="preview-section-browser-based"]');
          const browserBasedSection = browserBasedExpandableSection.find('[data-test-id="preview-section-table-browser-based"]');

          expect(browserBasedExpandableSection.length).toEqual(1);
          expect(browserBasedSection.length).toEqual(1);

          done();
        });
    });
  });

  describe('when a sub section does not exist for an application type', () => {
    it('should not render the browsed based application type', (done) => {
      const context = {
        section: {
          sections: {
            'some-other-section': {
              answers: {
                'some-question': 'Some data',
              },
            },
          },
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);
          const browserBasedExpandableSection = $('[data-test-id="preview-section-browser-based"]');

          expect(browserBasedExpandableSection.length).toEqual(0);

          done();
        });
    });
  });
});
