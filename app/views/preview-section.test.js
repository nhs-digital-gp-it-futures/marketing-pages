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

        expect($('h2').text().trim()).toEqual('Some section title');

        done();
      });
  });

  it('should render a single question when the section has only one question', (done) => {
    const context = {
      section: {
        title: 'Some section title',
        questions: [
          {
            id: 'some-question-id',
            title: 'Some question title',
            data: 'Some question data',
          },
        ],
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const sectionQuestion = $('[data-test-id="preview-section-question-some-question-id"]');

        expect(sectionQuestion.find('[data-test-id="preview-section-question-title"]').text().trim()).toEqual('Some question title');
        expect(sectionQuestion.find('[data-test-id="preview-section-question-data"]').text().trim()).toEqual('Some question data');

        done();
      });
  });

  it('should render a multiple question when the section has multiple questions', (done) => {
    const context = {
      section: {
        title: 'Some section title',
        questions: [
          {
            id: 'some-first-question-id',
            title: 'Some first question title',
            data: 'Some first question data',
          },
          {
            id: 'some-second-question-id',
            title: 'Some second question title',
            data: 'Some second question data',
          },
        ],
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const firstSectionQuestion = $('[data-test-id="preview-section-question-some-first-question-id"]');
        const secondSectionQuestion = $('[data-test-id="preview-section-question-some-second-question-id"]');

        expect(firstSectionQuestion.find('[data-test-id="preview-section-question-title"]').text().trim()).toEqual('Some first question title');
        expect(firstSectionQuestion.find('[data-test-id="preview-section-question-data"]').text().trim()).toEqual('Some first question data');

        expect(secondSectionQuestion.find('[data-test-id="preview-section-question-title"]').text().trim()).toEqual('Some second question title');
        expect(secondSectionQuestion.find('[data-test-id="preview-section-question-data"]').text().trim()).toEqual('Some second question data');


        done();
      });
  });
});
