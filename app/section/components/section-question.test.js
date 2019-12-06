import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../test-utils/testHarness';

const macroWrapper = `{% from './section/components/section-question.njk' import sectionQuestion %}
                        {{ sectionQuestion(question) }}`;

describe('section-question', () => {
  describe('when question type is bulletpoint-list', () => {
    it('should render the bullepoint-list component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'bulletpoint-list',
        },
      };

      const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-bulletpoint-list"] > div');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is textarea-field', () => {
    it('should render the textarea-field component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'textarea-field',
        },
      };

      const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-textarea-field"] > div');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is text-field', () => {
    it('should render the text-field component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'text-field',
        },
      };

      const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-text-field"] > div');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is checkbox-options', () => {
    it('should render the checkbox-options component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'checkbox-options',
        },
      };

      const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-checkbox-options"] > div');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is radiobutton-options', () => {
    it('should render the radiobutton-options component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'radiobutton-options',
        },
      };

      const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-radiobutton-options"] > div');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });
});
