import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './fields/text-field.njk' import textField %}
                            {{ textField(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('textField', () => {
  it('should render the main advice', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('label.nhsuk-label').text().trim()).toEqual('Some really important main advice');

        done();
      });
  });

  it('should render the additional advice', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('span.nhsuk-hint').text().trim()).toEqual('Some not so important additional advice');

        done();
      });
  });

  it('should render the input text field', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('input').length).toEqual(1);

        done();
      });
  });

  it('should render the text field with the data populated', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
        data: 'Some populated data',
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('input').val()).toEqual('Some populated data');

        done();
      });
  });
});
