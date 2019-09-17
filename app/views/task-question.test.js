import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './task-question.njk' import taskQuestion %}
                            {{ taskQuestion(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('task-question', () => {
  it('should render the main advice of the question', (done) => {
    const context = {
      question: {
        mainAdvice: 'main advice for question',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="task-question-main-advice"]').text().trim()).toEqual('main advice for question');

        done();
      });
  });

  it('should render any additional advice', (done) => {
    const context = {
      question: {
        mainAdvice: 'main advice for question',
        additionalAdvice: [
          'first additional advice',
          'second additional advice',
          'third additional advice',
        ],
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const additionalAdvice = $('[data-test-id="task-question-additional-advice"]');

        expect(additionalAdvice.find('.nhsuk-label').length).toEqual(3);

        done();
      });
  });
});
