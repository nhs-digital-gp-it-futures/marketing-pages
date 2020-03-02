import { status } from '../status';
import { getReadyStatus } from './getReadyStatus';
import { ApiProvider } from '../../../apiProvider';

jest.mock('../../../apiProvider');

describe('getReadyStatus', () => {
  it('should return \'Healthy\' when BuyingCatalogueApi and DocumentApi are both \'Healthy\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.healthy.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.healthy.message,
    });
    expect(await getReadyStatus()).toBe(status.healthy);
  });

  it('should return \'Degraded\' when BuyingCatalogueApi is \'Healthy\' and DocumentApi is \'Degraded\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.healthy.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.degraded.message,
    });
    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return \'Degraded\' when BuyingCatalogueApi is \'Healthy\' and DocumentApi is \'Unhealthy\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.healthy.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.unhealthy.message,
    });
    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return \'Degraded\' when BuyingCatalogueApi is \'Degraded\' and DocumentApi is \'Healthy\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.degraded.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.healthy.message,
    });
    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return \'Degraded\' when BuyingCatalogueApi is \'Degraded\' and DocumentApi is \'Degraded\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.degraded.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.degraded.message,
    });
    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return \'Degraded\' when BuyingCatalogueApi is \'Degraded\' and DocumentApi is \'Unhealthy\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.degraded.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.unhealthy.message,
    });
    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return \'Unhealthy\' when BuyingCatalogueApi is \'Unhealthy\' and DocumentApi is \'Healthy\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.unhealthy.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.healthy.message,
    });
    expect(await getReadyStatus()).toBe(status.unhealthy);
  });

  it('should return \'Unhealthy\' when BuyingCatalogueApi is \'Unhealthy\' and DocumentApi is \'Degraded\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.unhealthy.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.degraded.message,
    });
    expect(await getReadyStatus()).toBe(status.unhealthy);
  });

  it('should return \'Unhealthy\' when BuyingCatalogueApi is \'Unhealthy\' and DocumentApi is \'Unhealthy\'', async () => {
    ApiProvider.prototype.getBuyingCatalogueApiHealth.mockResolvedValue({
      data: status.unhealthy.message,
    });
    ApiProvider.prototype.getDocumentApiHealth.mockResolvedValue({
      data: status.unhealthy.message,
    });
    expect(await getReadyStatus()).toBe(status.unhealthy);
  });
});
