import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const aTaskContext = title => ({
  task: {
    URL: 'someUrl',
    title,
  },
});

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './dashboard-section-task.njk' import dashboardSectionTask %}
                            {{ dashboardSectionTask(task) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('dashboard-section-task', () => {
  it('should render the task title', (done) => {
    const dummyApp = createDummyApp(aTaskContext('Some Task Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-task-title"]').text().trim()).toEqual('Some Task Title');

        done();
      });
  });
});
