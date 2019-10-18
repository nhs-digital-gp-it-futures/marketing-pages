import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './sub-dashboard-section.njk' import subDashboardSection %}
                            {{ subDashboardSection(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('sub-dashboard-section', () => {
  it('should render the inset', (done) => {
    const context = {
      section: {
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.nhsuk-inset-text').length).toEqual(1);

        done();
      });
  });

  it('should render the dashboard section', (done) => {
    const context = {
      section: {
      },

    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('li[data-test-id^="dashboard-section-"]').length).toEqual(1);

        done();
      });
  });
});
