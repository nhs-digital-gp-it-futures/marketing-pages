import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createMarketingDashboardContext } from './contextCreator';
import { createInitialMarketingData } from './helpers';

export const getMarketingPageDashboardContext = async () => {
  // Get manifest
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  // Get marketing data
  const solutionData = await axios.get('http://localhost:5000/api/v1/solution/S100000-001');
  const solution = solutionData.data;

  const { marketingData } = solution;

  // if marketing data is empty for the solution id. 
  // Submit some json with all the tasks with the status as incomplete.
  if (!marketingData) {
    solution.marketingData = createInitialMarketingData(dashboardManifest);
    // await axios.post('http://localhost:5000/api/v1/solution/S100000-001', solution);
  }

  // generate context from manifest
  const context = createMarketingDashboardContext(dashboardManifest, solution.marketingData);

  return context;
};
