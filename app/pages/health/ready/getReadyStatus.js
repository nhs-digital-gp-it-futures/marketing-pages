import { getData } from '../../../apiProvider';
import { status } from '../status';

export const getReadyStatus = async () => {
  let buyingCatalogueApi;
  let documentApi;
  try {
    buyingCatalogueApi = await getData({ endpointLocator: 'getBuyingCatalogueApiHealth' });
  } catch (e) {
    buyingCatalogueApi = status.unhealthy.message;
  }
  try {
    documentApi = await getData({ endpointLocator: 'getDocumentApiHealth' });
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
