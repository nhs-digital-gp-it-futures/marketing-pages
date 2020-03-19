import { status } from '../status';
import { getReadyStatus } from './getReadyStatus';
import * as apiProvider from '../../../apiProvider';

jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
}));

describe('getReadyStatus', () => {
  it('should return "Healthy" when BuyingCatalogueApi and DocumentApi are both "Healthy"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.healthy.message })
      .mockResolvedValueOnce({ data: status.healthy.message });

    expect(await getReadyStatus()).toBe(status.healthy);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Healthy" and DocumentApi is "Degraded"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.healthy.message })
      .mockResolvedValueOnce({ data: status.degraded.message });

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Healthy" and DocumentApi is "Unhealthy"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.healthy.message })
      .mockResolvedValueOnce({ data: status.unhealthy.message });

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Degraded" and DocumentApi is "Healthy"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.degraded.message })
      .mockResolvedValueOnce({ data: status.healthy.message });

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Degraded" and DocumentApi is "Degraded"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.degraded.message })
      .mockResolvedValueOnce({ data: status.degraded.message });

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Degraded" and DocumentApi is "Unhealthy"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.degraded.message })
      .mockResolvedValueOnce({ data: status.unhealthy.message });

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Unhealthy" when BuyingCatalogueApi is "Unhealthy" and DocumentApi is "Healthy"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.unhealthy.message })
      .mockResolvedValueOnce({ data: status.healthy.message });

    expect(await getReadyStatus()).toBe(status.unhealthy);
  });

  it('should return "Unhealthy" when BuyingCatalogueApi is "Unhealthy" and DocumentApi is "Degraded"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.unhealthy.message })
      .mockResolvedValueOnce({ data: status.degraded.message });

    expect(await getReadyStatus()).toBe(status.unhealthy);
  });

  it('should return "Unhealthy" when BuyingCatalogueApi is "Unhealthy" and DocumentApi is "Unhealthy"', async () => {
    apiProvider.getData
      .mockResolvedValueOnce({ data: status.unhealthy.message })
      .mockResolvedValueOnce({ data: status.unhealthy.message });

    expect(await getReadyStatus()).toBe(status.unhealthy);
  });
});
