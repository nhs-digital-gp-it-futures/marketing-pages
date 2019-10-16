import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './error-summary.njk' import errorSummary %}
                            {{ errorSummary(errors) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('errorSummary', () => {
  it('should render the error summary title', (done) => {
    const context = {
      errors: [],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.nhsuk-error-summary h2').text().trim()).toEqual('There is a problem');

        done();
      });
  });

  it('should render the error summary body', (done) => {
    const context = {
      errors: [],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.nhsuk-error-summary p').text().trim()).toEqual('To complete this page, resolve the following errors;');

        done();
      });
  });

  it('should render the one error if the context only contains a single error', (done) => {
    const context = {
      errors: [
        {
          text: 'This is the first error',
          href: '#link-to-first-error',
        },
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('ul li a').text().trim()).toEqual('This is the first error');
        expect($('ul li a').attr('href')).toEqual('#link-to-first-error');

        done();
      });
  });

  it('should render multiple errors if the context contains multiple errors', (done) => {
    const context = {
      errors: [
        {
          text: 'This is the first error',
          href: '#link-to-first-error',
        },
        {
          text: 'This is the second error',
          href: '#link-to-second-error',
        },
        {
          text: 'This is the third error',
          href: '#link-to-third-error',
        },
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('ul li').length).toEqual(3);

        done();
      });
  });
});
