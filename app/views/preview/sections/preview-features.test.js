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
                            {{ previewFeatures(featuresSection) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-features', () => {
  it('should render the title of the section', (done) => {
    const context = {
      featuresSection: {
      },
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

  it('should render the listings', (done) => {
    const context = {
      featuresSection: {
        questions: {
          listings: {
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

        const listingsQuestion = $('[data-test-id="preview-section-question-listings"]');
        expect(listingsQuestion.find('[data-test-id="preview-question-data-bulletlist"]').length).toEqual(1);

        done();
      });
  });
});
