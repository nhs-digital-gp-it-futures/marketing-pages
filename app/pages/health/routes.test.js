import { status } from './status';
import { testHealthStatus } from '../../test-utils/testFunctions/testHealthStatus';

jest.mock('../../apiProvider');

describe('GET /health', () => {
  describe('GET /live', () => {
    it('should return \'Healthy\' when app is running', testHealthStatus('/live', {
      expected: status.healthy,
    }));
  });

  describe('GET /ready', () => {
    it('should return \'Healthy\' when BuyingCatalogueApi and DocumentApi are both \'Healthy\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.healthy,
      DocumentApi: status.healthy,
      expected: status.healthy,
    }));

    it('should return \'Degraded\' when BuyingCatalogueApi is \'Healthy\' and DocumentApi is \'Degraded\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.healthy,
      DocumentApi: status.degraded,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BuyingCatalogueApi is \'Healthy\' and DocumentApi is \'Unhealthy\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.healthy,
      DocumentApi: status.unhealthy,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BuyingCatalogueApi is \'Degraded\' and DocumentApi is \'Healthy\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.degraded,
      DocumentApi: status.healthy,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BuyingCatalogueApi is \'Degraded\' and DocumentApi is \'Degraded\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.degraded,
      DocumentApi: status.degraded,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BuyingCatalogueApi is \'Degraded\' and DocumentApi is \'Unhealthy\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.degraded,
      DocumentApi: status.unhealthy,
      expected: status.degraded,
    }));

    it('should return \'Unhealthy\' when BuyingCatalogueApi is \'Unhealthy\' and DocumentApi is \'Healthy\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.unhealthy,
      DocumentApi: status.healthy,
      expected: status.unhealthy,
    }));

    it('should return \'Unhealthy\' when BuyingCatalogueApi is \'Unhealthy\' and DocumentApi is \'Degraded\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.unhealthy,
      DocumentApi: status.degraded,
      expected: status.unhealthy,
    }));

    it('should return \'Unhealthy\' when BuyingCatalogueApi is \'Unhealthy\' and DocumentApi is \'Unhealthy\'', testHealthStatus('/ready', {
      BuyingCatalogueApi: status.unhealthy,
      DocumentApi: status.unhealthy,
      expected: status.unhealthy,
    }));
  });
});
