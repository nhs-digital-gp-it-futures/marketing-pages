import { getData } from 'buying-catalogue-library';
import { status } from '../status';
import { getEndpoint } from '../../../endpoints';
import { logger } from '../../../logger';

export const getReadyStatus = async () => {
  let buyingCatalogueApi;
  let documentApi;
  try {
    const endpoint = getEndpoint({ endpointLocator: 'getBuyingCatalogueApiHealth' });
    buyingCatalogueApi = await getData({ endpoint, logger });
  } catch (e) {
    buyingCatalogueApi = status.unhealthy.message;
  }
  try {
    const endpoint = getEndpoint({ endpointLocator: 'getDocumentApiHealth' });
    documentApi = await getData({ endpoint, logger });
  } catch (e) {
    documentApi = status.unhealthy.message;
  }

  const isHealthy = healthcheckResponse => healthcheckResponse === status.healthy.message;
  const isUnhealthy = healthcheckResponse => healthcheckResponse === status.unhealthy.message;

  if (isHealthy(buyingCatalogueApi) && isHealthy(documentApi)) {
    return status.healthy;
  }

  if (isUnhealthy(buyingCatalogueApi)) {
    return status.unhealthy;
  }

  return status.degraded;
};
