import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview-question.njk' import previewQuestion %}
                            {{ previewQuestion(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-question', () => {
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

  it('should render the data of the question', (done) => {
    const context = {
      question: {
        id: 'some-question-id',
        data: 'Some question data',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-data"]').text().trim()).toEqual('Some question data');

        done();
      });
  });

  it('should not render the title if it is not available', (done) => {
    const context = {
      question: {
        id: 'some-question-id',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-title"]').length).toEqual(0);

        done();
      });
  });

  it('should render the data of the question as a list if the type is bulletpoint-list', (done) => {
    const context = {
      question: {
        id: 'some-question-id',
        type: 'bulletpoint-list',
        data: [
          'Some first data',
          'Some second data',
          'Some third data',
        ],
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-data"] ul').length).toEqual(1);
        expect($('[data-test-id="preview-question-data"] li').length).toEqual(3);

        done();
      });
  });

  it('should render the data of the question as a link if the type is a link', (done) => {
    const context = {
      question: {
        id: 'some-question-id',
        data: 'wwww.whatalink.com',
        type: 'link',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-question-data"] a').text().trim()).toEqual('wwww.whatalink.com');
        expect($('[data-test-id="preview-question-data"] a').attr('href')).toEqual('wwww.whatalink.com');

        done();
      });
  });

});
