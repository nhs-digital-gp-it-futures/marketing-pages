import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createMarketingDashboardContext, createTaskPageContext } from './contextCreator';
import { createMarketingDataIfRequired, createUpdatedSolutionData } from './helpers';

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
  const context = createMarketingDashboardContext(
    solutionId, dashboardManifest, solution.marketingData,
  );

  return context;
};

export const getTaskPageContext = async (solutionId, taskId) => {
  const taskManifest = new ManifestProvider().getTaskManifest(taskId);

  const context = createTaskPageContext(solutionId, taskManifest);

  return context;
};

export const postTask = async (solutionId, taskId, taskData) => {
  const solutionData = await axios.get(`http://localhost:5000/api/v1/solution/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const updatedSolutionData = createUpdatedSolutionData(taskId, existingSolutionData, taskData);

  await axios.post(`http://localhost:5000/api/v1/solution/${solutionId}`, updatedSolutionData);

  return true;
};
