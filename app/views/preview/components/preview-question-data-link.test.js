import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/components/preview-question-data-link.njk' import previewQuestionDataLink %}
                            {{ previewQuestionDataLink(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-question-link', () => {
  it('should render the link when provided', (done) => {
    const context = {
      question: {
        data: 'www.somelink.com',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-data-link"] a').text().trim()).toEqual('www.somelink.com');
        expect($('[data-test-id="preview-question-data-link"] a').attr('href')).toEqual('www.somelink.com');

        done();
      });
  });

  it('should not render the data when not provided', (done) => {
    const context = {
      question: {
        data: 'Some question data',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-data-text"]').length).toEqual(0);

        done();
      });
  });
});
