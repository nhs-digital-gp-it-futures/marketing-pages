import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createTaskPageContext } from './contextCreators/createTaskPageContext';
import { createMarketingDashboardContext } from './contextCreators/createMarketingDashboardContext';
import { createMarketingDataIfRequired } from './helpers/createMarketingDataIfRequired';
import { createUpdatedSolutionData } from './helpers/createUpdatedSolutionData';
import { validateTaskData } from './helpers/validateTaskData';

export const getMarketingPageDashboardContext = async (solutionId) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  const solutionData = await axios.get(`http://localhost:5000/api/v1/solution/${solutionId}`);
  const { solution } = solutionData.data;

  solution.marketingData = createMarketingDataIfRequired(dashboardManifest, solution);
  await axios.post(`http://localhost:5000/api/v1/solution/${solutionId}`, solution);

  const context = createMarketingDashboardContext(
    solutionId, dashboardManifest, solution.marketingData,
  );

  return context;
};

export const getTaskPageContext = async (solutionId, taskId) => {
  const taskManifest = new ManifestProvider().getTaskManifest(taskId);

  const solutionData = await axios.get(`http://localhost:5000/api/v1/solution/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const context = createTaskPageContext(solutionId, taskManifest, existingSolutionData);

  return context;
};

export const getTaskPageErrorContext = async (solutionId, taskId, taskData, validationErrors) => {
  const taskManifest = new ManifestProvider().getTaskManifest(taskId);

  const context = createTaskPageErrorContext(solutionId, taskManifest, taskData, validationErrors);

  return context;
};

export const validateTask = (taskId, taskData) => {
  const taskManifest = new ManifestProvider().getTaskManifest(taskId);
  return validateTaskData(taskManifest, taskData);
};

export const postTask = async (solutionId, taskId, taskData) => {
  const solutionData = await axios.get(`http://localhost:5000/api/v1/solution/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const updatedSolutionData = createUpdatedSolutionData(taskId, existingSolutionData, taskData);

  await axios.post(`http://localhost:5000/api/v1/solution/${solutionId}`, updatedSolutionData);

  return true;
};
