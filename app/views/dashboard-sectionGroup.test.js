import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

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

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './dashboard-sectionGroup.njk' import dashboardSectionGroup %}
                            {{ dashboardSectionGroup(sectionGroup) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('dashboard-sectionGroup', () => {
  it('should render the title of the sectionGroup group', (done) => {
    const dummyApp = createDummyApp(aSectionGroupContext());
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
    const dummyApp = createDummyApp(aSectionGroupWithOneSection);

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.app-section-list__item').length).toEqual(1);

        done();
      });
  });

  it('should render a section list of 2 if the sectionGroup group contains 2 sections', (done) => {
    const aSectionGroupWithTwoSections = aSectionGroupContext([aSectionContext('Some First section'), aSectionContext('Some Second section')]);
    const dummyApp = createDummyApp(aSectionGroupWithTwoSections);

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.app-section-list__item').length).toEqual(2);

        done();
      });
  });
});
