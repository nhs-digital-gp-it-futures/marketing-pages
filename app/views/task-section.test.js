import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';


const aSectionGroupContext = {
  section: {
    id: 'some-section-group-id',
    name: 'Section Group Title',
  },
};

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './task-section.njk' import taskSection %}
                            {{ taskSection(section) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('task-section', () => {
  it('should render the title of the section group', (done) => {
    const dummyApp = createDummyApp(aSectionGroupContext);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h2').text().trim()).toEqual('Section Group Title');

        done();
      });
  });
});
