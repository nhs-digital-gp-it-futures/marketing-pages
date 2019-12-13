import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../test-utils/testHarness';

const macroWrapper = `{% from './section/components/fields/combobox-options.njk' import comboboxOptions %}
                        {{ comboboxOptions(question) }}`;

describe('comboboxOptions', () => {
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

        expect($('.nhsuk-label').text().trim()).toEqual('Some really important main advice');

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

        expect($('.nhsuk-hint').text().trim()).toEqual('Some not so important additional advice');

        done();
      });
  });

  it('should render the combo box', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'Some really important main advice',
        additionalAdvice: 'Some not so important additional advice',
        options: [],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const comboboxComponent = $('[data-test-id=combobox-options-fieldId]');
        const combobox = comboboxComponent.find('select');

        expect(combobox.length).toEqual(1);
        expect(combobox.find('option').length).toEqual(0);

        done();
      });
  });

  it('should render the combo box with options', (done) => {
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

        const comboboxComponent = $('[data-test-id=combobox-options-fieldId]');
        const combobox = comboboxComponent.find('select');

        expect(combobox.find('option').length).toEqual(2);
        expect(combobox.find('option:nth-child(1)').attr('value')).toEqual('first-option');
        expect(combobox.find('option:nth-child(1)').text().trim()).toEqual('First Option');
        expect(combobox.find('option:nth-child(2)').attr('value')).toEqual('second-option');
        expect(combobox.find('option:nth-child(2)').text().trim()).toEqual('Second Option');

        done();
      });
  });

  it('should render the combo box with a selected option', (done) => {
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
            selected: true,
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const comboboxComponent = $('[data-test-id=combobox-options-fieldId]');
        const combobox = comboboxComponent.find('select');

        expect(combobox.find('option').length).toEqual(2);
        expect(combobox.find('option:nth-child(1)').attr('value')).toEqual('first-option');
        expect(combobox.find('option:nth-child(1)').attr('selected')).toBeUndefined();
        expect(combobox.find('option:nth-child(2)').attr('value')).toEqual('second-option');
        expect(combobox.find('option:nth-child(2)').attr('selected')).toEqual('selected');

        done();
      });
  });

  it('should render the combo box with a disabled option', (done) => {
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
            disabled: true,
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const comboboxComponent = $('[data-test-id=combobox-options-fieldId]');
        const combobox = comboboxComponent.find('select');

        expect(combobox.find('option').length).toEqual(2);
        expect(combobox.find('option:nth-child(1)').attr('value')).toEqual('first-option');
        expect(combobox.find('option:nth-child(1)').attr('disabled')).toBeUndefined();
        expect(combobox.find('option:nth-child(2)').attr('value')).toEqual('second-option');
        expect(combobox.find('option:nth-child(2)').attr('disabled')).toEqual('disabled');

        done();
      });
  });

  it('should render the combo box with an error if the context provided contains an error', (done) => {
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
            disabled: true,
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

        const comboboxComponent = $('[data-test-id=combobox-options-fieldId]');

        expect(comboboxComponent.length).toEqual(1);
        expect(comboboxComponent.find('select.nhsuk-select--error').length).toEqual(1);
        expect(comboboxComponent.find('.nhsuk-error-message').text().trim()).toEqual('Error: Some error message');

        done();
      });
  });
});
