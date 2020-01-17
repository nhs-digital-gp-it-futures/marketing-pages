import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../test-utils/testHarness';

const template = 'pages/preview/template.njk';

describe('preview page', () => {
  it('should render the title of the preview page', (done) => {
    const context = {};

    const dummyApp = testHarness().createComponentDummyApp(template, context);
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

    const dummyApp = testHarness().createComponentDummyApp(template, context);
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

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="view-features"]').length).toEqual(1);

        done();
      });
  });

  it('should render the client application types section when provided', (done) => {
    const context = {
      sections: {
        'client-application-types': {},
      },
    };

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="view-client-application-types"]').length).toEqual(1);

        done();
      });
  });

  it('should render the hosting types section when provided', (done) => {
    const context = {
      sections: {
        'hosting-types': {},
      },
    };

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="view-hosting-types"]').length).toEqual(1);

        done();
      });
  });
});
