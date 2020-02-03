import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../test-utils/testHarness';

const template = './pages/authority/dashboard/template.njk';

describe('authority - dashboard page', () => {
  it('should render the title of the authority dashboard page', (done) => {
    const context = {};

    const dummyApp = testHarness().createComponentDummyApp(template, context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h1').text().trim()).toEqual('Marketing Page - Authority - Dashboard');

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
});
