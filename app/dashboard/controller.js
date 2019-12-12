import axios from 'axios';
import { ManifestProvider } from '../manifestProvider';
import { createDashboardPageContext } from './createDashboardPageContext';
import { apiHost } from '../config';

export const getMarketingPageDashboardContext = async (solutionId, validationErrors) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  const dashboardDataRaw = await axios.get(`${apiHost}/api/v1/Solutions/${solutionId}/dashboard`);
  const dashboardData = dashboardDataRaw.data;

  const context = createDashboardPageContext(
    solutionId, dashboardManifest, dashboardData.sections, validationErrors,
  );

  return context;
};

export const postSubmitForModeration = async (solutionId) => {
  try {
    await axios.put(`${apiHost}/api/v1/Solutions/${solutionId}/SubmitForReview`, {});
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};
