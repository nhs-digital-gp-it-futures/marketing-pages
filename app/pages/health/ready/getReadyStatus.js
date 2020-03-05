import { ApiProvider } from '../../../apiProvider';
import { status } from '../status';

export async function getReadyStatus() {
  let buyingCatalogueApi;
  let documentApi;
  try {
    buyingCatalogueApi = (await new ApiProvider().getBuyingCatalogueApiHealth()).data;
  } catch (e) {
    buyingCatalogueApi = status.unhealthy.message;
  }
  try {
    documentApi = (await new ApiProvider().getDocumentApiHealth()).data;
  } catch (e) {
    documentApi = status.unhealthy.message;
  }

  const isHealthy = Api => Api === status.healthy.message;
  const isUnhealthy = Api => Api === status.unhealthy.message;

  if (isHealthy(buyingCatalogueApi) && isHealthy(documentApi)) {
    return status.healthy;
  }

  if (isUnhealthy(buyingCatalogueApi)) {
    return status.unhealthy;
  }

  return status.degraded;
}
