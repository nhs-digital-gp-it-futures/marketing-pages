import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../test-utils/testHarness';

const macroWrapper = `{% from './section/components/fields/textarea-field.njk' import textareaField %}
                        {{ textareaField(question) }}`;

describe('textarea', () => {
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

  it('should render the text area', (done) => {
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
        expect(question.find('textarea').length).toEqual(1);

        done();
      });
  });

  it('should render the text area with specific amount of rows as specified in the context', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        rows: 10,
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('textarea').attr('rows')).toEqual(' 10 ');

        done();
      });
  });


  it('should render the text area with the data populated', (done) => {
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
        expect(question.find('textarea').val()).toEqual('Some populated data');

        done();
      });
  });

  it('should render the textarea-field as an error if the context provided contains an error', (done) => {
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
        expect(question.find('.nhsuk-error-message').text().trim()).toEqual('Error: Some error message');
        expect(question.find('div[data-test-id="textarea-field-error"]').length).toEqual(1);

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
        expect(question.find('[data-test-id="textarea-field-footer"]').text().trim()).toEqual('Some footer based advice');

        done();
      });
  });
});
