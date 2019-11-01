import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/sections/preview-browser-based.njk' import previewBrowserBased %}
                            {{ previewBrowserBased(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-browser-based', () => {
  it('should render the supported browsers answer', (done) => {
    const context = {
      section: {
        sections: {
          'browsers-supported': {
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

        const browserBasedSectionTable = $('[data-test-id="preview-section-table-browser-based"]');
        const supportedBrowserQuestionRow = browserBasedSectionTable.find('[data-test-id="preview-section-table-row-supported-browsers"]');

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
