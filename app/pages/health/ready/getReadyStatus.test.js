import { getData } from 'buying-catalogue-library';
import { status } from '../status';
import { getReadyStatus } from './getReadyStatus';

jest.mock('buying-catalogue-library');

describe('getReadyStatus', () => {
  it('should return "Healthy" when BuyingCatalogueApi and DocumentApi are both "Healthy"', async () => {
    getData
      .mockReturnValueOnce(status.healthy.message)
      .mockReturnValueOnce(status.healthy.message);

    expect(await getReadyStatus()).toBe(status.healthy);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Healthy" and DocumentApi is "Degraded"', async () => {
    getData
      .mockReturnValueOnce(status.healthy.message)
      .mockReturnValueOnce(status.degraded.message);

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Healthy" and DocumentApi is "Unhealthy"', async () => {
    getData
      .mockReturnValueOnce(status.healthy.message)
      .mockReturnValueOnce(status.unhealthy.message);

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Degraded" and DocumentApi is "Healthy"', async () => {
    getData
      .mockReturnValueOnce(status.degraded.message)
      .mockReturnValueOnce(status.healthy.message);

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Degraded" and DocumentApi is "Degraded"', async () => {
    getData
      .mockReturnValueOnce(status.degraded.message)
      .mockReturnValueOnce(status.degraded.message);

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Degraded" when BuyingCatalogueApi is "Degraded" and DocumentApi is "Unhealthy"', async () => {
    getData
      .mockReturnValueOnce(status.degraded.message)
      .mockReturnValueOnce(status.unhealthy.message);

    expect(await getReadyStatus()).toBe(status.degraded);
  });

  it('should return "Unhealthy" when BuyingCatalogueApi is "Unhealthy" and DocumentApi is "Healthy"', async () => {
    getData
      .mockReturnValueOnce(status.unhealthy.message)
      .mockReturnValueOnce(status.healthy.message);

    expect(await getReadyStatus()).toBe(status.unhealthy);
  });

  it('should return "Unhealthy" when BuyingCatalogueApi is "Unhealthy" and DocumentApi is "Degraded"', async () => {
    getData
      .mockReturnValueOnce(status.unhealthy.message)
      .mockReturnValueOnce(status.degraded.message);

    expect(await getReadyStatus()).toBe(status.unhealthy);
  });

  it('should return "Unhealthy" when BuyingCatalogueApi is "Unhealthy" and DocumentApi is "Unhealthy"', async () => {
    getData
      .mockReturnValueOnce(status.unhealthy.message)
      .mockReturnValueOnce(status.unhealthy.message);

    expect(await getReadyStatus()).toBe(status.unhealthy);
  });
});
