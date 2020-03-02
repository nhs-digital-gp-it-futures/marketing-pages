import { ApiProvider } from '../../../apiProvider';
import { status } from '../status';

export async function getReadyStatus() {
  const buyingCatalogueApi = (await new ApiProvider().getBuyingCatalogueApiHealth()).data;
  const documentApi = (await new ApiProvider().getDocumentApiHealth()).data;

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
