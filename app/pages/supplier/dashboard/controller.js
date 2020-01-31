import { ManifestProvider } from '../../../manifestProvider';
import { ApiProvider } from '../../../apiProvider';
import { createDashboardPageContext } from './createDashboardPageContext';

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
    await new ApiProvider().putSubmitForModeration({ solutionId });
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};
