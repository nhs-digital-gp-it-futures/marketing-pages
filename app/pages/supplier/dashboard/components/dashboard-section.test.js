import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../../test-utils/testHarness';

const aSectionContext = (
  title, requirement = 'Mandatory', status = 'INCOMPLETE', isActive = true, defaultMessage = undefined,
) => ({
  section: {
    URL: 'someUrl',
    title,
    requirement,
    status,
    isActive,
    defaultMessage,
  },
});

const macroWrapper = `{% from './pages/supplier/dashboard/components/dashboard-section.njk' import dashboardSection %}
                            {{ dashboardSection(section) }}`;

describe('dashboard-section', () => {
  it('should render the section title', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext('Some section Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-title"]').text().trim()).toEqual('Some section Title');

        done();
      });
  });

  it('should render the requirement of the section', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext('Some section Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-requirement"]').text().trim()).toEqual('Mandatory');

        done();
      });
  });

  it('should render status of the section as INCOMPLETE', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext('Some section Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-status"]').text().trim()).toEqual('INCOMPLETE');

        done();
      });
  });

  it('should render status of the section as COMPLETE', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext('Some section Title', 'Mandatory', 'COMPLETE'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-status"]').text().trim()).toEqual('COMPLETE');

        done();
      });
  });

  it('should render defaultMessage for the section if the showDetaultMessage flag is true', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext(
      'Some section Title', undefined, undefined, false, 'some default message',
    ));

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-default-message"]').text().trim()).toEqual('some default message');

        done();
      });
  });

  it('should not render the section title as a link when not active', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext(
      'Some section Title', undefined, undefined, false, 'some default message',
    ));

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-title"] a').length).toEqual(0);

        done();
      });
  });
});
