import request from 'supertest';
import express from 'express';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('preview-page.njk', context);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview page', () => {
  it.only('should render the title of the preview page', (done) => {
    const context = {};

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h1').text().trim()).toEqual('Preview Page');

        done();
      });
  });

  it('should render one section if one section is provided', (done) => {
    const context = {
      sections: [{}],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id^="preview-section-"]').length).toEqual(1);

        done();
      });
  });

  it('should render the submit for moderation button', (done) => {
    const context = {};

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-submit-button"] button').length).toEqual(1);
        expect($('[data-test-id="preview-submit-button"] button').text().trim()).toEqual('Submit for moderation');

        done();
      });
  });
});
