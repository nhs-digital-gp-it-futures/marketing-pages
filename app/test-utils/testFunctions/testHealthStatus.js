import request from 'supertest';
import { ApiProvider } from '../../apiProvider';
import { App } from '../../../app';
import routes from '../../pages/health/routes';

export const testHealthStatus = (route, { BAPI, DAPI, expected }) => () => {
  if (BAPI && DAPI) {
    ApiProvider.prototype.getApiReadyHealth.mockResolvedValue({ data: BAPI.message });
    ApiProvider.prototype.getDocumentApiReadyHealth.mockResolvedValue({ data: DAPI.message });
  }

  const app = new App().createApp();
  app.use('/health', routes);

  return request(app).get(`/health${route}`).expect(expected.code)
    .then((res) => {
      expect(res.text).toBe(expected.message);
    });
};
