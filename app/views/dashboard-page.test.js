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

  it('should render the sections on the dashboard page', (done) => {
    const context = {
      sections: [
        {
          title: 'Some section title',
          tasks: [],
        },
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-1"]').length).toEqual(1);

        done();
      });
  });
});
