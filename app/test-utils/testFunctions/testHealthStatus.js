import request from 'supertest';
import { ApiProvider } from '../../apiProvider';
import { App } from '../../../app';
import routes from '../../pages/health/routes';

export const testHealthStatus = (route, { BuyingCatalogueApi, DocumentApi, expected }) => () => {
  if (BuyingCatalogueApi) {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: BuyingCatalogueApi.message,
    });
  }
  if (DocumentApi) {
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: DocumentApi.message,
    });
  }

  const app = new App().createApp();
  app.use('/health', routes);

  return request(app).get(`/health${route}`).expect(expected.code)
    .then((res) => {
      expect(res.text).toBe(expected.message);
    });
};
