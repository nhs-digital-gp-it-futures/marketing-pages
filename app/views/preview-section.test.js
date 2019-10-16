import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview-section.njk' import previewSection %}
                            {{ previewSection(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-section', () => {
  it('should render the title of the section', (done) => {
    const context = {
      section: {
        title: 'Some section title',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h3').text().trim()).toEqual('Some section title');

        done();
      });
  });

  it('should render a single question when the section has only one question', (done) => {
    const context = {
      section: {
        title: 'Some section title',
        questions: [{}],
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const sectionQuestions = $('[data-test-id^="preview-section-question"]');

        expect(sectionQuestions.length).toEqual(1);

        done();
      });
  });

  it('should render a multiple question when the section has multiple questions', (done) => {
    const context = {
      section: {
        title: 'Some section title',
        questions: [{}, {}, {}],
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const sectionQuestions = $('[data-test-id^="preview-section-question"]');

        expect(sectionQuestions.length).toEqual(3);

        done();
      });
  });
});
