import request from 'supertest';
import { App } from '../app';
import routes from './routes';
import * as previewControllers from './pages/preview/controller';
import * as dashboardControllers from './pages/supplier/dashboard/controller';

jest.mock('./logger');

const mockPreviewContext = {
  sections: {
    'solution-description': { answers: {} },
    features: { answers: {} },
    'contact-details': { answers: {} },
    capabilities: { answers: {} },
  },
};

describe('GET /healthcheck', () => {
  it('should return the correct status and text', () => {
    const app = new App().createApp();
    app.use('/', routes);

    return request(app)
      .get('/healthcheck')
      .expect(200)
      .then((res) => {
        expect(res.text).toBe('Marketing pages is Running!!!');
      });
  });
});

describe('GET /solution/:solutionId/preview', () => {
  afterEach(() => {
    previewControllers.getPreviewPageContext.mockReset();
  });

  it('should return the correct status and text if there is no error', () => {
    previewControllers.getPreviewPageContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockPreviewContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1/preview')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1>Preview Page</h1>')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });
});

describe('Error handler', () => {
  it('should return error page if there is an error from /preview', () => {
    previewControllers.getPreviewPageContext = jest.fn().mockImplementation(() => Promise.reject());
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1/preview')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1>Preview Page</h1>')).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });

  it('should return error page if there is an error from the supplier route', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.reject());
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/supplier/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="dashboard"')).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('GET *', () => {
  afterEach(() => {
    previewControllers.getPreviewPageContext.mockReset();
  });

  it('should return error page if url cannot be matched', () => {
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/aaaa')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1 class="nhsuk-heading-l nhsuk-u-padding-left-3" data-test-id="error-page-title">Error: Incorrect url - please check it is valid and try again</h1>')).toEqual(true);
      });
  });
});
