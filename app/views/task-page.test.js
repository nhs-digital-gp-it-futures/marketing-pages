import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('task-page.njk', context);
  });

  app.use(dummyRouter);

  return app;
};

describe('task page', () => {
  it('should render the title of the task', (done) => {
    const context = {
      title: 'Title of the task',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('h1').text().trim()).toEqual('Title of the task');

        done();
      });
  });
});
