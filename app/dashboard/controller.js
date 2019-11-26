import axios from 'axios';
import { ManifestProvider } from '../manifestProvider';
import { createDashboardPageContext } from './createDashboardPageContext';

export const getMarketingPageDashboardContext = async (solutionId, validationErrors) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  const dashboardDataRaw = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/dashboard`);
  const dashboardData = dashboardDataRaw.data;

  const context = createDashboardPageContext(
    solutionId, dashboardManifest, dashboardData.sections, validationErrors,
  );

  return context;
};
