import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/components/preview-question-data-bulletlist.njk' import previewQuestionDataBulletlist %}
                            {{ previewQuestionDataBulletlist(questionData) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-question-data-bulletlist', () => {
  it('should render the data of the question as a list when provided', (done) => {
    const context = {
      questionData: [
        'Some first data',
        'Some second data',
        'Some third data',
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-data-bulletlist"] ul').length).toEqual(1);
        expect($('[data-test-id="preview-question-data-bulletlist"] li').length).toEqual(3);

        done();
      });
  });

  it('should not render the data when not provided', (done) => {
    const context = {};

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-data-bulletlist"]').length).toEqual(0);

        done();
      });
  });
});
