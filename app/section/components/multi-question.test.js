import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../test-utils/testHarness';

const macroWrapper = `{% from './section/components/multi-question.njk' import multiQuestion %}
                        {{ multiQuestion(parentQuestion) }}`;

describe('multi-question', () => {
  it('should render the main advice of the question', (done) => {
    const context = {
      parentQuestion: {
        id: 'fieldId',
        mainAdvice: 'main advice for question',
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="multi-question-main-advice"]')
          .text().trim()).toEqual('main advice for question');

        done();
      });
  });

  it('should render any additional advice', (done) => {
    const context = {
      parentQuestion: {
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

        const additionalAdvice = $('[data-test-id="multi-question-additional-advice"]');
        expect(additionalAdvice.text().trim()).toEqual('some additional advice for question');

        done();
      });
  });

  it('should render a single inner question', (done) => {
    const context = {
      parentQuestion: {
        id: 'fieldId',
        questions: [
          {
            id: 'fieldId[innerQuestionId]',
            type: 'text-field',
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="section-question-text-field"]').length).toEqual(1);

        done();
      });
  });

  it('should render multiple inner question', (done) => {
    const context = {
      parentQuestion: {
        id: 'fieldId',
        questions: [
          {
            id: 'fieldId[innerQuestionId]',
            type: 'text-field',
          },
          {
            id: 'fieldId[anotherInnerQuestionId]',
            type: 'text-field',
          },
        ],
      },
    };

    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="section-question-text-field"]').length).toEqual(2);

        done();
      });
  });
});
