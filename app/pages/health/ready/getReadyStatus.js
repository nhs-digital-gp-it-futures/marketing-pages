import { getData } from '../../../apiProvider';
import { status } from '../status';

export const getReadyStatus = async () => {
  let buyingCatalogueApiStatusMessage;
  let documentApiStatusMessage;
  try {
    buyingCatalogueApiStatusMessage = await getData({ endpointLocator: 'getBuyingCatalogueApiHealth' });
  } catch (e) {
    buyingCatalogueApiStatusMessage = status.unhealthy.message;
  }
  try {
    documentApiStatusMessage = await getData({ endpointLocator: 'getDocumentApiHealth' });
  } catch (e) {
    documentApiStatusMessage = status.unhealthy.message;
  }

  const isHealthy = apiStatusMessage => apiStatusMessage === status.healthy.message;
  const isUnhealthy = apiStatusMessage => apiStatusMessage === status.unhealthy.message;

  if (isHealthy(buyingCatalogueApiStatusMessage) && isHealthy(documentApiStatusMessage)) {
    return status.healthy;
  }

  if (isUnhealthy(buyingCatalogueApiStatusMessage)) {
    return status.unhealthy;
  }

  return status.degraded;
};
