import axios from 'axios';
import { ManifestProvider } from '../../manifestProvider';
import { ApiProvider } from '../../apiProvider';
import { createDashboardPageContext } from './createDashboardPageContext';
import { apiHost } from '../../config';
import logger from '../../logger';

export const getMarketingPageDashboardContext = async ({ solutionId, validationErrors }) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();
  const dashboardDataRaw = await new ApiProvider().getMainDashboardData({ solutionId });

  if (dashboardDataRaw && dashboardDataRaw.data) {
    const dashboardData = dashboardDataRaw.data;
    const context = createDashboardPageContext({
      solutionId,
      dashboardManifest,
      marketingDataSections: dashboardData.sections,
      validationErrors,
    });
    return context;
  }
  throw new Error('No data returned');
};

export const postSubmitForModeration = async ({ solutionId }) => {
  try {
    const endpoint = `${apiHost}/api/v1/Solutions/${solutionId}/SubmitForReview`;
    logger.info(`api called: [PUT] ${endpoint}`);
    await axios.put(endpoint, {});
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};
