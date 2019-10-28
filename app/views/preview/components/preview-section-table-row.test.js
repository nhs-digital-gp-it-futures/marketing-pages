import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/components/preview-section-table-row.njk' import previewSectionTableRow %}
                            {{ previewSectionTableRow(questionId, questionTitle, innerComponent) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-section-table-row', () => {
  it('should the key of the row', (done) => {
    const context = {
      questionId: 'some-question-id',
      questionTitle: 'Some question title',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-section-table-row-some-question-id"]').text().trim()).toEqual('Some question title');

        done();
      });
  });

  it('should render innerComponent of the expandable section', (done) => {
    const context = {
      questionId: 'some-question-id',
      innerComponent: '<p>Some inner component</p>',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-section-table-row-some-question-id"] p').text().trim()).toEqual('Some inner component');

        done();
      });
  });
});
