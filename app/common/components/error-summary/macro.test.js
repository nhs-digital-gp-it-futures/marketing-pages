import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../test-utils/testHarness';

const macroWrapper = `{% from './common/components/error-summary/macro.njk' import errorSummary %}
                        {{ errorSummary(errors) }}`;

describe('errorSummary', () => {
  it('should render the error summary title', (done) => {
    const context = {
      errors: [],
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
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

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
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

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
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

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('ul li').length).toEqual(3);

        done();
      });
  });
});
