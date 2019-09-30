import request from 'supertest';
import express from 'express';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('section-page.njk', context);
  });

  app.use(dummyRouter);

  return app;
};

describe('section page', () => {
  it('should render the title of the section', (done) => {
    const context = {
      title: 'Title of the section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h2[data-test-id="section-title"]').text().trim()).toEqual('Title of the section');

        done();
      });
  });

  it('should render the main advice of the section', (done) => {
    const context = {
      title: 'Title of the section',
      mainAdvice: 'This is the main advice for this section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h4[data-test-id="section-main-advice"]').text().trim()).toEqual('This is the main advice for this section');

        done();
      });
  });

  it('should render any additional advice of the section', (done) => {
    const context = {
      title: 'Title of the section',
      additionalAdvice: [
        'First bit of addtional advice',
        'Second bit of addtional advice',
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        context.additionalAdvice.map((advice, idx) => {
          expect($(`div[data-test-id="section-additional-advice"] p:nth-child(${idx + 1})`).text().trim()).toEqual(advice);
        });

        done();
      });
  });

  it('should render all the questions for the section', (done) => {
    const context = {
      title: 'Title of the section',
      questions: [{}, {}, {}],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="section-question"]').length).toEqual(3);

        done();
      });
  });

  it('should render a button to submit the form', (done) => {
    const context = {
      title: 'Title of the section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="section-submit-button"] button').length).toEqual(1);

        done();
      });
  });
});
