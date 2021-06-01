import request from 'supertest';
import { consentCookieExpiration } from 'buying-catalogue-library';
import { App } from './app';
import routes from './routes';
import * as dashboardControllers from './pages/common/dashboard/controller';

jest.mock('buying-catalogue-library');

describe('Check if consentCookieExpiration is being called /', () => {
  it('consentCookieExpiration should be called from routes', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.resolve({}));
    jest.mock('buying-catalogue-library', () => ({
      consentCookieExpiration: jest.fn(),
    }));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/supplier/solution/1')
      .expect(200)
      .then(() => {
        expect(consentCookieExpiration).toHaveBeenCalled();
      });
  });
});
