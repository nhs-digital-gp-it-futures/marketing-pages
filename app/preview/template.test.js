import request from 'supertest';
import express from 'express';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('preview/template.njk', context);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview page', () => {
  it('should render the title of the preview page', (done) => {
    const context = {};

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h1').text().trim()).toEqual('Preview Page');

        done();
      });
  });

  it('should render the solutions-description section when provided', (done) => {
    const context = {
      sections: {
        'solution-description': {},
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="view-solution-description"]').length).toEqual(1);

        done();
      });
  });

  it('should render the features section when provided', (done) => {
    const context = {
      sections: {
        features: {},
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="view-features"]').length).toEqual(1);

        done();
      });
  });

  it('should render the client-application-types section when provided', (done) => {
    const context = {
      sections: {
        'client-application-types': {},
      },
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="view-client-application-types"]').length).toEqual(1);

        done();
      });
  });
});
