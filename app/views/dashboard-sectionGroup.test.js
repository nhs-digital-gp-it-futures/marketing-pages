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
  sectionGroup: {
    id: 'some-sectionGroup-group-id',
    title: 'sectionGroup Group Title',
    tasks,
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

  it('should render a task list of 1 if the sectionGroup group only contains the 1 task', (done) => {
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

  it('should render a task list of 2 if the sectionGroup group contains 2 tasks', (done) => {
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
