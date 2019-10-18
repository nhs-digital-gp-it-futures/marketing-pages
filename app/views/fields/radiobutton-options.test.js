import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './fields/radiobutton-options.njk' import radiobuttonOptions %}
                            {{ radiobuttonOptions(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('radiobuttonOptions', () => {
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

        expect($('.nhsuk-fieldset__legend').text().trim()).toEqual('Some really important main advice');

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

        expect($('.nhsuk-hint').text().trim()).toEqual('Some not so important additional advice');

        done();
      });
  });

  it('should render the radio button options', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
        options: [
          {
            value: 'first-option',
            text: 'First Option',
          },
          {
            value: 'second-option',
            text: 'Second Option',
          },
        ],
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.nhsuk-radios__item').length).toEqual(2);

        done();
      });
  });
});
