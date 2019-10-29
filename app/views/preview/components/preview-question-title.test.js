import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/components/preview-question-title.njk' import previewQuestionTitle %}
                            {{ previewQuestionTitle(questionId, questionTitle) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-question-title', () => {
  it('should render the title of the question', (done) => {
    const context = {
      questionId: 'some-question-id',
      questionTitle: 'Some question title',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-title"]').text().trim()).toEqual('Some question title');

        done();
      });
  });
});
