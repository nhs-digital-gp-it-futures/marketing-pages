import request from 'supertest';
import cheerio from 'cheerio';
import { testHarness } from '../../test-utils/testHarness';

const aSectionContext = title => ({
  URL: 'someUrl',
  title,
});

const aSectionGroupContext = (sections = []) => ({
  sectionGroup: {
    id: 'some-sectionGroup-group-id',
    title: 'sectionGroup Group Title',
    sections,
  },
});

const macroWrapper = `{% from './dashboard/components/dashboard-sectionGroup.njk' import dashboardSectionGroup %}
                        {{ dashboardSectionGroup(sectionGroup) }}`;

describe('dashboard-sectionGroup', () => {
  it('should render the title of the sectionGroup group', (done) => {
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionGroupContext());
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h2').text().trim()).toEqual('sectionGroup Group Title');

        done();
      });
  });

  it('should render a section list of 1 if the sectionGroup group only contains the 1 section', (done) => {
    const aSectionGroupWithOneSection = aSectionGroupContext([aSectionContext('Some section')]);
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionGroupWithOneSection);

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.bc-c-section-list__item').length).toEqual(1);

        done();
      });
  });

  it('should render a section list of 2 if the sectionGroup group contains 2 sections', (done) => {
    const aSectionGroupWithTwoSections = aSectionGroupContext([aSectionContext('Some First section'), aSectionContext('Some Second section')]);
    const dummyApp = testHarness().createTemplateDummyApp(macroWrapper, aSectionGroupWithTwoSections);

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.bc-c-section-list__item').length).toEqual(2);

        done();
      });
  });
});
