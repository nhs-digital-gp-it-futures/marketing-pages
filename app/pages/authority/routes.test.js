import request from 'supertest';
import { App } from '../../../app';
import routes from './routes';
import * as dashboardControllers from './dashboard/controller';

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

describe('GET /authority/solution/:solutionId', () => {
  it('should return the correct status and text if there is no error', () => {
    dashboardControllers.getAuthorityMarketingPageDashboardContext = jest.fn()
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
