import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview-question-title.njk' import previewQuestionTitle %}
                            {{ previewQuestionTitle(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-question-title', () => {
  describe('when there is no error for the question', () => {
    it('should render the title of the question', (done) => {
      const context = {
        question: {
          id: 'some-question-id',
          title: 'Some question title',
        },
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

  describe('when there is an error for the question', () => {
    const context = {
      question: {
        id: 'some-question-id',
        title: 'Some question title',
        error: {
          message: 'Some error message',
        },
      },
    };

    it('should render the error message for the question', (done) => {
      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const questionTitleAsError = $('[data-test-id="preview-question-title-error"]');

          expect(questionTitleAsError.find('.nhsuk-error-message').length).toEqual(1);
          expect(questionTitleAsError.find('.nhsuk-error-message').text().trim()).toEqual('Error: Some error message');

          done();
        });
    });

    it('should render the title of the question', (done) => {
      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const questionTitleAsError = $('[data-test-id="preview-question-title-error"]');

          expect(questionTitleAsError.find('.nhsuk-label').length).toEqual(1);
          expect(questionTitleAsError.find('.nhsuk-label').text().trim()).toEqual('Some question title');

          done();
        });
    });
  });
});
