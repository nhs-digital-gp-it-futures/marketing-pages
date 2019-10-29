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
            'browser-based': {
              answers: {
                'supported-browsers': ['chrome'],
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
          const browserBasedSectionTable = $('[data-test-id="preview-section-table-browser-based"]');
          const supportedBrowserQuestionRow = browserBasedSectionTable.find('[data-test-id="preview-section-table-row-supported-browsers"]');

          expect(browserBasedExpandableSection.length).toEqual(1);
          expect(browserBasedSectionTable.length).toEqual(1);

          expect(supportedBrowserQuestionRow.length).toEqual(1);
          expect(supportedBrowserQuestionRow
            .find('.nhsuk-summary-list__key').text().trim()).toEqual('Browsers Supported');
          expect(supportedBrowserQuestionRow
            .find('.nhsuk-summary-list__value')
            .find('[data-test-id="preview-question-data-bulletlist"]').length).toEqual(1);

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
