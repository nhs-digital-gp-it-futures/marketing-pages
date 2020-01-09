import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../../test-utils/testHarness';

const macroWrapper = `{% from './pages/section/components/fields/checkbox-options.njk' import checkboxOptions %}
                        {{ checkboxOptions(question) }}`;

describe('checkboxOptions', () => {
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
        expect(question.find('.nhsuk-fieldset__legend').text().trim()).toEqual('Some really important main advice');

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
        expect(question.find('.nhsuk-hint').text().trim()).toEqual('Some not so important additional advice');

        done();
      });
  });

  it('should render the checkbox options', (done) => {
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

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('.nhsuk-checkboxes__item').length).toEqual(2);
        expect(question.find('.nhsuk-checkboxes__item:nth-child(1)').find('input').attr('value')).toEqual('first-option');
        expect(question.find('.nhsuk-checkboxes__item:nth-child(2)').find('input').attr('value')).toEqual('second-option');

        done();
      });
  });

  it('should render the checked checkbox option', (done) => {
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
            checked: true,
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const question = $('div[data-test-id="question-fieldId"]');
        expect(question.find('.nhsuk-checkboxes__item').length).toEqual(2);
        expect(question.find('.nhsuk-checkboxes__item:nth-child(1)').find('input').attr('checked')).toBeUndefined();
        expect(question.find('.nhsuk-checkboxes__item:nth-child(1)').find('input').attr('value')).toEqual('first-option');
        expect(question.find('.nhsuk-checkboxes__item:nth-child(2)').find('input').attr('checked')).toEqual('checked');
        expect(question.find('.nhsuk-checkboxes__item:nth-child(2)').find('input').attr('value')).toEqual('second-option');

        done();
      });
  });

  it('should render the checkbox option as an error if the context provided contains an error', (done) => {
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
            checked: true,
          },
        ],
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
        expect(question.find('div[data-test-id="checkbox-options-error"]').length).toEqual(1);
        expect(question.find('.nhsuk-error-message').text().trim()).toEqual('Error: Some error message');

        done();
      });
  });
});
