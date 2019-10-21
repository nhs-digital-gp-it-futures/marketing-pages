import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const aSectionContext = (
  id, sections = undefined,
) => ({
  section: {
    id,
    sections,
  },
});

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './dashboard-section-row.njk' import dashboardSectionRow %}
                            {{ dashboardSectionRow(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('dashboard-section-row', () => {
  it('should render the dashboard section', (done) => {
    const dummyApp = createDummyApp(aSectionContext('some-section-id'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-some-section-id"]').length).toEqual(1);

        done();
      });
  });

  it('should not render the dashboard sub sections if no sections are provided', (done) => {
    const dummyApp = createDummyApp(aSectionContext('some-section-id'));
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
    const dummyApp = createDummyApp(aSectionContext('some-section-id', subSections));

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
