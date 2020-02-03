import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../../../test-utils/testHarness';

const macroWrapper = `{% from './pages/common/section/components/fields/bulletpoint-list.njk' import bulletpointList %}
                        {{ bulletpointList(question) }}`;

describe('bulletpoint-list', () => {
  it('should render the main advice of the question', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'main advice for question',
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="bulletpoint-list-main-advice"]')
          .text().trim()).toEqual('main advice for question');

        done();
      });
  });

  it('should render any additional advice', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        mainAdvice: 'main advice for question',
        additionalAdvice: 'some additional advice for question',
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        const additionalAdvice = $('[data-test-id="bulletpoint-list-additional-advice"]');
        expect(additionalAdvice.text().trim()).toEqual('some additional advice for question');

        done();
      });
  });

  it('should render a single text field if context only contains a single field', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        fields: [
          {
            id: 'fieldId-1',
            data: '',
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="field-fieldId-1"]').length).toEqual(1);
        expect($('[data-test-id="field-fieldId-2"]').length).toEqual(0);

        done();
      });
  });

  it('should render multiple text if the context contains multiple fields', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        fields: [
          {
            id: 'fieldId-1',
            data: '',
          },
          {
            id: 'fieldId-2',
            data: '',
          },
          {
            id: 'fieldId-3',
            data: '',
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="field-fieldId-1"]').length).toEqual(1);
        expect($('[data-test-id="field-fieldId-2"]').length).toEqual(1);
        expect($('[data-test-id="field-fieldId-3"]').length).toEqual(1);
        expect($('[data-test-id="field-fieldId-4"]').length).toEqual(0);

        done();
      });
  });

  it('should render the text field as error if the context contains an error for the field', (done) => {
    const context = {
      question: {
        id: 'fieldId',
        fields: [
          {
            id: 'fieldId-1',
            data: 'good',
          },
          {
            id: 'fieldId-2',
            data: 'This is not good',
            error: {
              message: 'some error message',
            },
          },
          {
            id: 'fieldId-3',
            data: 'good',
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="field-fieldId-1"]').length).toEqual(1);
        expect($('[data-test-id="field-fieldId-2"]').length).toEqual(0);
        expect($('[data-test-id="field-error-fieldId-2"]').length).toEqual(1);
        expect($('[data-test-id="field-fieldId-3"]').length).toEqual(1);

        done();
      });
  });
});
