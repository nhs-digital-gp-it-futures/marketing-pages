import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../test-utils/testHarness';

const template = './dashboard/template.njk';

describe('dashboard page', () => {
  it('should render the title of the dashboard page', (done) => {
    const context = {};

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h1').text().trim()).toEqual('Marketing Page - Dashboard');

        done();
      });
  });

  it('should render the error summary if errors', (done) => {
    const context = {
      title: 'Title of the section',
      errors: [{}],
    };

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="error-summary"]').length).toEqual(1);

        done();
      });
  });

  it('should render the preview button at the top of the page', (done) => {
    const context = {
      previewUrl: '/solution/S100000-001/preview',
    };

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-preview-button"] a').length).toEqual(1);
        expect($('[data-test-id="dashboard-preview-button"] a').text().trim()).toEqual('Preview Marketing page');
        expect($('[data-test-id="dashboard-preview-button"] a').attr('href')).toEqual('/solution/S100000-001/preview');

        done();
      });
  });

  it('should render the sectionGroups on the dashboard page', (done) => {
    const context = {
      sectionGroups: [
        {
          title: 'Some section group title',
          sections: [],
        },
      ],
    };

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id^="dashboard-sectionGroup"]').length).toEqual(1);

        done();
      });
  });

  it('should render the Submit for moderation button at the bottom of the page', (done) => {
    const context = {
      submitForModerationUrl: '/solution/S100000-001/submitForModeration',
    };

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').length).toEqual(1);
        expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').text().trim()).toEqual('Submit for moderation');
        expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').attr('href')).toEqual('/solution/S100000-001/submitForModeration');

        done();
      });
  });
});
