import request from 'supertest';
import express from 'express';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('dashboard-page.njk', context);
  });

  app.use(dummyRouter);

  return app;
};

describe('dashboard page', () => {
  it('should render the title of the dashboard page', (done) => {
    const context = {};

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h1').text().trim()).toEqual('Marketing Page - Dashboard');

        done();
      });
  });

  it('should render the preview button at the top of the page', (done) => {
    const context = {
      previewUrl: '/S100000-001/preview',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-preview-button"] a').length).toEqual(1);
        expect($('[data-test-id="dashboard-preview-button"] a').text().trim()).toEqual('Preview Marketing page');
        expect($('[data-test-id="dashboard-preview-button"] a').attr('href')).toEqual('/S100000-001/preview');

        done();
      });
  });

  it('should render the sectionGroups on the dashboard page', (done) => {
    const context = {
      sectionGroups: [
        {
          title: 'Some section group title',
          sections: [],
        },
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id^="dashboard-sectionGroup"]').length).toEqual(1);

        done();
      });
  });

  it('should render the Submit for moderation button at the bottom of the page', (done) => {
    const context = {
      submitForModerationUrl: '/S100000-001/submitForModeration',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').length).toEqual(1);
        expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').text().trim()).toEqual('Submit for moderation');
        expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').attr('href')).toEqual('/S100000-001/submitForModeration');

        done();
      });
  });
});
