import { ApiProvider } from '../../../apiProvider';
import { status } from '../status';

export async function getReadyStatus() {
  const BAPI = (await new ApiProvider().getApiReadyHealth()).data;
  const DAPI = (await new ApiProvider().getDocumentApiReadyHealth()).data;

  const isHealthy = API => API === status.healthy.message;
  const isUnhealthy = API => API === status.unhealthy.message;

  if (isHealthy(BAPI) && isHealthy(DAPI)) {
    return status.healthy;
  }

  if (isUnhealthy(BAPI)) {
    return status.unhealthy;
  }

  return status.degraded;
}
