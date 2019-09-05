import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const aTaskContext = title => ({
  URL: 'someUrl',
  title,
});

const aSectionGroupContext = (tasks = []) => ({
  section: {
    id: 'some-section-group-id',
    title: 'Section Group Title',
    tasks,
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
  it('should render the title of the section group', (done) => {
    const dummyApp = createDummyApp(aSectionGroupContext());
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h2').text().trim()).toEqual('Section Group Title');

        done();
      });
  });

  it('should render a task list of 1 if the section group only contains the 1 task', (done) => {
    const aSectionWithOneTask = aSectionGroupContext([aTaskContext('Some Task')]);
    const dummyApp = createDummyApp(aSectionWithOneTask);

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.app-task-list__item').length).toEqual(1);

        done();
      });
  });

  it('should render a task list of 2 if the section group contains 2 tasks', (done) => {
    const aSectionWithOneTask = aSectionGroupContext([aTaskContext('Some First Task'), aTaskContext('Some Second Task')]);
    const dummyApp = createDummyApp(aSectionWithOneTask);

    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('.app-task-list__item').length).toEqual(2);

        done();
      });
  });
});
