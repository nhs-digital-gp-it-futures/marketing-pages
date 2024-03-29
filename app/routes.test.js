import request from 'supertest';
import { App } from './app';
import routes from './routes';
import * as dashboardControllers from './pages/common/dashboard/controller';

jest.mock('./logger');

describe('/supplier route', () => {
  it('should call the supplier route when navigating to /supplier', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.resolve({}));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/supplier/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="dashboard"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });
});

describe('/authority route', () => {
  it('should call the authority route when navigating to /authority', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.resolve({}));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/authority/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="dashboard"')).toEqual(true);
      });
  });
});

describe('Error handler', () => {
  it('should return error page if there is an error from the /supplier route', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/supplier/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="dashboard"')).toEqual(false);
        expect(res.text.includes('data-test-id="error-title"')).toEqual(true);
      });
  });

  it('should return error page if there is an error from the /authority route', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/authority/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="dashboard"')).toEqual(false);
        expect(res.text.includes('data-test-id="error-title"')).toEqual(true);
      });
  });
});

describe('GET *', () => {
  it('should return error page if url cannot be matched', () => {
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/aaaa')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1 class="nhsuk-heading-l nhsuk-u-margin-top-5" data-test-id="error-title">Incorrect url /aaaa</h1>')).toEqual(true);
        expect(res.text.includes('<p data-test-id="error-description">Please check it is valid and try again</p>')).toEqual(true);
      });
  });
});
