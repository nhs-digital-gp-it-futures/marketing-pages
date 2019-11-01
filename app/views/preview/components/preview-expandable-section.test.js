import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './preview/components/preview-expandable-section.njk' import previewExpandableSection %}
                            {{ previewExpandableSection(sectionId, sectionTitle, innerComponent) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('preview-expandable-section', () => {
  it('should render title of the expandable section', (done) => {
    const context = {
      sectionId: 'some-section-id',
      sectionTitle: 'Some section title',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-section-some-section-id"]').text().trim()).toEqual('Some section title');

        done();
      });
  });

  it('should render innerComponent of the expandable section', (done) => {
    const context = {
      sectionId: 'some-section-id',
      sectionTitle: 'Some section title',
      innerComponent: '<p>Some inner component</p>',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="preview-section-some-section-id"] p').text().trim()).toEqual('Some inner component');

        done();
      });
  });
});
