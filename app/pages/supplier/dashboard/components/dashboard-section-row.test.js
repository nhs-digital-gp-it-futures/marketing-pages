import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../../../test-utils/testHarness';

const aSectionContext = (
  id, sections = undefined,
) => ({
  section: {
    id,
    sections,
  },
});

const macroWrapper = `{% from './pages/supplier/dashboard/components/dashboard-section-row.njk' import dashboardSectionRow %}
                        {{ dashboardSectionRow(section) }}`;

describe('dashboard-section-row', () => {
  it('should render the dashboard section', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext('some-section-id'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-some-section-id"]').length).toEqual(1);

        done();
      });
  });

  it('should not render the dashboard sub sections if no sections are provided', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext('some-section-id'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id^="dashboard-sub-section"]').length).toEqual(0);

        done();
      });
  });

  it('should render the all the section and all the sub sections', (done) => {
    const firstSubSection = aSectionContext('first-sub-section-id');
    const secondSubSection = aSectionContext('second-sub-section-id');
    const subSections = [firstSubSection, secondSubSection];
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionContext('some-section-id', subSections));

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-some-section-id"]').length).toEqual(1);
        expect($('[data-test-id^="dashboard-sub-section-"]').length).toEqual(2);

        done();
      });
  });
});
