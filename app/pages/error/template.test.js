import request from 'supertest';
import express from 'express';
import cheerio from 'cheerio';
import { App } from '../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('pages/error/template.njk', context);
  });

  app.use(dummyRouter);

  return app;
};


describe('error page', () => {
  it('should render the error title', (done) => {
    const context = { message: 'an error message' };
    const app = createDummyApp(context);
    request(app)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);
        const errorTitle = $('[data-test-id="error-page-title"]');
        expect(errorTitle.length).toEqual(1);
        expect(errorTitle.text().trim()).toEqual(`Error: ${context.message}`);
        done();
      });
  });

  it('should render a backLink to the home page', (done) => {
    const app = createDummyApp({});
    request(app)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);
        const homepageBackLink = $('[data-test-id="go-to-home-page-link"]');
        expect(homepageBackLink.length).toEqual(1);
        expect(homepageBackLink.text().trim()).toEqual('Go to Home Page');
        expect($(homepageBackLink).find('a').attr('href')).toEqual('/');
        done();
      });
  });
});
