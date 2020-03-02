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
    it('should return \'Healthy\' when BAPI and DAPI are both \'Healthy\'', testHealthStatus('/ready', {
      BAPI: status.healthy,
      DAPI: status.healthy,
      expected: status.healthy,
    }));

    it('should return \'Degraded\' when BAPI is \'Healthy\' and DAPI is \'Degraded\'', testHealthStatus('/ready', {
      BAPI: status.healthy,
      DAPI: status.degraded,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BAPI is \'Healthy\' and DAPI is \'Unhealthy\'', testHealthStatus('/ready', {
      BAPI: status.healthy,
      DAPI: status.unhealthy,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BAPI is \'Degraded\' and DAPI is \'Healthy\'', testHealthStatus('/ready', {
      BAPI: status.degraded,
      DAPI: status.healthy,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BAPI is \'Degraded\' and DAPI is \'Degraded\'', testHealthStatus('/ready', {
      BAPI: status.degraded,
      DAPI: status.degraded,
      expected: status.degraded,
    }));

    it('should return \'Degraded\' when BAPI is \'Degraded\' and DAPI is \'Unhealthy\'', testHealthStatus('/ready', {
      BAPI: status.degraded,
      DAPI: status.unhealthy,
      expected: status.degraded,
    }));

    it('should return \'Unhealthy\' when BAPI is \'Unhealthy\' and DAPI is \'Healthy\'', testHealthStatus('/ready', {
      BAPI: status.unhealthy,
      DAPI: status.healthy,
      expected: status.unhealthy,
    }));

    it('should return \'Unhealthy\' when BAPI is \'Unhealthy\' and DAPI is \'Degraded\'', testHealthStatus('/ready', {
      BAPI: status.unhealthy,
      DAPI: status.degraded,
      expected: status.unhealthy,
    }));

    it('should return \'Unhealthy\' when BAPI is \'Unhealthy\' and DAPI is \'Unhealthy\'', testHealthStatus('/ready', {
      BAPI: status.unhealthy,
      DAPI: status.unhealthy,
      expected: status.unhealthy,
    }));
  });
});
