import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createMarketingDashboardContext } from './contextCreator';
import { createMarketingDataIfRequired } from './helpers';

export const getMarketingPageDashboardContext = async (solutionId) => {
  // Get manifest
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  // Get marketing data
  const solutionData = await axios.get(`http://localhost:5000/api/v1/solution/${solutionId}`);
  const { solution } = solutionData.data;
  const { marketingData } = solution;

  solution.marketingData = createMarketingDataIfRequired(dashboardManifest, marketingData);
  await axios.post(`http://localhost:5000/api/v1/solution/${solutionId}`, solution);

  // generate context from manifest
  const context = createMarketingDashboardContext(dashboardManifest, solution.marketingData);

  return context;
};
