import request from 'supertest';
import express from 'express';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('./section/template.njk', context);
  });

  app.use(dummyRouter);

  return app;
};

describe('section page', () => {
  it('should render the title of the section', (done) => {
    const context = {
      title: 'Title of the section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h2[data-test-id="section-title"]').text().trim()).toEqual('Title of the section');

        done();
      });
  });

  it('should render the main advice of the section', (done) => {
    const context = {
      title: 'Title of the section',
      mainAdvice: 'This is the main advice for this section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h4[data-test-id="section-main-advice"]').text().trim()).toEqual('This is the main advice for this section');

        done();
      });
  });

  it('should render any additional advice of the section', (done) => {
    const context = {
      title: 'Title of the section',
      additionalAdvice: [
        'First bit of addtional advice',
        'Second bit of addtional advice',
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        context.additionalAdvice.map((advice, idx) => {
          expect($(`div[data-test-id="section-additional-advice"] p:nth-child(${idx + 1})`).text().trim()).toEqual(advice);
        });

        done();
      });
  });

  it('should render the error summary if errors', (done) => {
    const context = {
      title: 'Title of the section',
      errors: [{}],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="error-summary"]').length).toEqual(1);

        done();
      });
  });

  it('should not render the error summary if no errors', (done) => {
    const context = {
      title: 'Title of the section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="error-summary"]').length).toEqual(0);

        done();
      });
  });

  it('should render all the questions for the section', (done) => {
    const context = {
      title: 'Title of the section',
      questions: [
        { type: 'text-field' },
        { type: 'text-field' },
        { type: 'text-field' },
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('div[data-test-id="section-question-text-field"]').length).toEqual(3);

        done();
      });
  });

  it('should render a multi-question', (done) => {
    const context = {
      questions: [
        {
          id: 'parent-question-id',
          type: 'multi-question',
          questions: [
            {
              id: 'parent-question-id[inner-question-id]',
            },
          ],
        },
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('div[data-test-id="question-parent-question-id"]').length).toEqual(1);

        done();
      });
  });

  it('should render a button to submit the form', (done) => {
    const context = {
      title: 'Title of the section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="section-submit-button"] button').length).toEqual(1);

        done();
      });
  });

  it('should render the warning advise', (done) => {
    const context = {
      title: 'Title of the section',
      warningAdvice: 'Some warning advice',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="section-warning-advice"]').length).toEqual(1);
        expect($('[data-test-id="section-warning-advice"]').text().trim()).toEqual('Some warning advice');

        done();
      });
  });

  it('should render the return to all sections link', (done) => {
    const context = {
      title: 'Title of the section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="section-back-link"] a').length).toEqual(1);
        expect($('[data-test-id="section-back-link"] a').text().trim()).toEqual('Return to all sections');

        done();
      });
  });
});
