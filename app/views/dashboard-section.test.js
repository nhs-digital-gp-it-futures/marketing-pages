import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const aSectionContext = (
  title, requirement = 'Mandatory', status = 'INCOMPLETE', showDetaultMessage = false, defaultMessage = undefined,
) => ({
  section: {
    URL: 'someUrl',
    title,
    requirement,
    status,
    showDetaultMessage,
    defaultMessage,
  },
});

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './dashboard-section.njk' import dashboardSection %}
                            {{ dashboardSection(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('dashboard-section', () => {
  it('should render the section title', (done) => {
    const dummyApp = createDummyApp(aSectionContext('Some section Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-title"]').text().trim()).toEqual('Some section Title');

        done();
      });
  });

  it('should render the requirement of the section', (done) => {
    const dummyApp = createDummyApp(aSectionContext('Some section Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-requirement"]').text().trim()).toEqual('Mandatory');

        done();
      });
  });

  it('should render status of the section as INCOMPLETE', (done) => {
    const dummyApp = createDummyApp(aSectionContext('Some section Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-status"]').text().trim()).toEqual('INCOMPLETE');

        done();
      });
  });

  it('should render status of the section as COMPLETE', (done) => {
    const dummyApp = createDummyApp(aSectionContext('Some section Title', 'Mandatory', 'COMPLETE'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-status"]').text().trim()).toEqual('COMPLETE');

        done();
      });
  });

  it('should render defaultMessage for the section if the showDetaultMessage flag is true', (done) => {
    const dummyApp = createDummyApp(aSectionContext(
      'Some section Title', undefined, undefined, true, 'some default message',
    ));

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-default-message"]').text().trim()).toEqual('some default message');

        done();
      });
  });
});
