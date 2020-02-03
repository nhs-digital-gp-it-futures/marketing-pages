import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../../../test-utils/testHarness';

const macroWrapper = `{% from './pages/common/section/components/fields/text-field.njk' import textField %}
                        {{ textField(question) }}`;

describe('textField', () => {
  it('should render the main advice', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('label.nhsuk-label').text().trim()).toEqual('Some really important main advice');

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

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('span.nhsuk-hint').text().trim()).toEqual('Some not so important additional advice');

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

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('input').length).toEqual(1);

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

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('div[data-test-id="question-fieldId"] input').val()).toEqual('Some populated data');

        done();
      });
  });

  it('should render the text field as an error if the context provided contains an error', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
        data: 'Some populated data',
        error: {
          message: 'Some error message',
        },
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        const inputError = question.find('div[data-test-id="text-field-input-error"] .nhsuk-error-message');

        expect(inputError.length).toEqual(1);
        expect(inputError.text().trim()).toEqual('Error: Some error message');

        done();
      });
  });

  it('should render the footer advice', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
        footerAdvice: 'Some footer based advice',
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('[data-test-id="text-field-footer"]').text().trim()).toEqual('Some footer based advice');

        done();
      });
  });
});
