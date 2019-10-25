import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/sections/preview-features.njk' import previewFeatures %}
                            {{ previewFeatures(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-features', () => {
  it('should render the title of the features section', (done) => {
    const context = {
      section: {},
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h3').text().trim()).toEqual('Features');

        done();
      });
  });

  describe('when display is true for the question', () => {
    it('should render the listings', (done) => {
      const context = {
        section: {
          questions: {
            listing: {
              display: true,
              data: [
                'Some first data',
                'Some second data',
                'Some third data',
              ],
            },
          },
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const listingsQuestion = $('[data-test-id="preview-section-question-listing"]');
          expect(listingsQuestion.find('[data-test-id="preview-question-data-bulletlist"]').length).toEqual(1);

          done();
        });
    });
  });

  describe('when display is falsy for the question', () => {
    it('should render the listings', (done) => {
      const context = {
        section: {
          questions: {
            listing: {},
          },
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const listingsQuestion = $('[data-test-id="preview-section-question-listing"]');
          expect(listingsQuestion.length).toEqual(0);

          done();
        });
    });
  });

  it('should not render the features section when not provided', (done) => {
    const context = {
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-features"]').length).toEqual(0);

        done();
      });
  });
});
