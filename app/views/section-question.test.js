import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './section-question.njk' import sectionQuestion %}
                            {{ sectionQuestion(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('section-question', () => {
  describe('when question type is bulletpoint-list', () => {
    it('should render the bullepoint-list component', (done) => {
      const context = {
        question: {
          type: 'bulletpoint-list',
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const bulletpointList = $('[data-test-id="bulletpoint-list"]');

          expect(bulletpointList.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is textarea-field', () => {
    it('should render the textarea-field component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'textarea-field',
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const textareaField = $('[data-test-id="textarea-field-question-id"]');

          expect(textareaField.length).toEqual(1);

          done();
        });
    });
  });
});
