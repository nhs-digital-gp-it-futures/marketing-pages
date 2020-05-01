import request from 'supertest';
import { createReadStream, readFileSync } from 'fs';
import { getDocument } from 'buying-catalogue-library';
import path from 'path';
import { App } from '../../app';
import routes from './routes';
import * as dashboardControllers from '../common/dashboard/controller';
import * as sectionControllers from '../common/section/controller';

jest.mock('buying-catalogue-library');
getDocument
  .mockImplementation(() => Promise.resolve({ data: createReadStream(path.resolve(__dirname, 'data.pdf')) }));
jest.mock('../../logger');

const mockDashboardContext = {
  title: 'Dashboard title',
  previewUrl: '/',
  submitForModerationUrl: '/',
  returnToDashboardUrl: '/',
  sectionGroups: [
    {
      id: 'sectiongroup-id',
      title: 'Sectiongroup Title',
    },
  ],
};

const mockSectionContext = {
  title: 'Section Title',
  mainAdvice: 'Section Main Advice',
  additionalAdvice: [
    'Section additional advice',
  ],
  returnToDashboardUrl: '/',
  submitText: 'submitText',
  questions: [
    {
      id: 'a-question',
      type: 'text-field',
    },
  ],
};

const mockSectionPostData = {
  'a-question': '',
};


const mockPostSectionContext = {
  title: 'Post Section Title',
  mainAdvice: 'post section main advice',
  additionalAdvice: [
    'post section additional advice',
  ],
  returnToDashboardUrl: '/',
  submitText: 'submitText',
  errors: [
    {
      text: 'This is over the character limit',
      href: '#',
    },
  ],
  questions: [
    {
      id: 'a-question',
      type: 'text-field',
    },
  ],
};

const mockSectionErrorContext = {
  ...mockSectionContext,
  errors: [
    {
      text: 'This is over the character limit',
      href: '#',
    },
  ],
};

describe('authority dashboard', () => {
  describe('GET /authority/solution/:solutionId', () => {
    it('should return the correct status and text if there is no error', () => {
      dashboardControllers.getMarketingPageDashboardContext = jest.fn()
        .mockImplementation(() => Promise.resolve(mockDashboardContext));
      const app = new App().createApp();
      app.use('/authority', routes);
      return request(app)
        .get('/authority/solution/1')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="dashboard"')).toEqual(true);
        });
    });
  });

  describe('GET /authority/solution/:solutionId/section/:sectionId', () => {
    it('should return the correct status and text if there is no error', () => {
      sectionControllers.getSectionPageContext = jest.fn()
        .mockImplementation(() => Promise.resolve(mockSectionContext));
      const app = new App().createApp();
      app.use('/authority', routes);
      return request(app)
        .get('/authority/solution/1/section/a-section')
        .expect(200)
        .then((res) => {
          expect(res.text.includes(`<h1 data-test-id="section-title" class="nhsuk-u-margin-bottom-3">${mockSectionContext.title}</h1>`)).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('POST /authority/solution/:solutionId/section/:sectionId', () => {
    afterEach(() => {
      sectionControllers.postSection.mockReset();
    });

    it('should return the correct status and text if response.success is true', () => {
      sectionControllers.postSection = jest.fn()
        .mockImplementation(() => Promise.resolve({ ...mockPostSectionContext, success: true }));
      const app = new App().createApp();
      app.use('/authority', routes);
      return request(app)
        .post('/authority/solution/1/section/features')
        .send(mockSectionPostData)
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    it('should return the correct status and text if response.success is false', () => {
      sectionControllers.postSection = jest.fn()
        .mockImplementation(() => Promise.resolve({ 'listing-2': 'maxLength' }));
      sectionControllers.getSectionPageErrorContext = jest.fn()
        .mockImplementation(() => Promise.resolve(mockSectionErrorContext));
      const app = new App().createApp();
      app.use('/authority', routes);
      return request(app)
        .post('/authority/solution/1/section/features')
        .send(mockSectionPostData)
        .expect(200)
        .then((res) => {
          expect(res.text.includes('<div data-test-id="error-summary">')).toEqual(true);
          expect(res.text.includes(`<h1 data-test-id="section-title" class="nhsuk-u-margin-bottom-3">${mockSectionErrorContext.title}</h1>`)).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
          sectionControllers.getSectionPageErrorContext.mockReset();
        });
    });
  });

  describe('GET /solution/:solutionId/document/:documentName', () => {
    it('should return the correct status and text if there is no error', () => {
      const app = new App().createApp();
      app.use('/supplier', routes);
      return request(app)
        .get('/supplier/solution/1/document/somedoc')
        .expect(200)
        .then((res) => {
          expect(res.text).toEqual(readFileSync(path.resolve(__dirname, 'data.pdf'), 'utf8'));
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });
});
