import { ManifestProvider } from '../../../manifestProvider';
import { ApiProvider } from '../../../apiProvider';
import { createDashboardPageContext } from './createDashboardPageContext';

export const getMarketingPageDashboardContext = async ({
  solutionId, validationErrors, userContextType = 'supplier',
}) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest({ userContextType });
  const dashboardDataRaw = await new ApiProvider().getMainDashboardData({
    solutionId, userContextType,
  });

  if (dashboardDataRaw && dashboardDataRaw.data) {
    const dashboardData = dashboardDataRaw.data;
    const context = createDashboardPageContext({
      solutionId,
      solutionName: dashboardData.name,
      dashboardManifest,
      marketingDataSections: dashboardData.sections,
      validationErrors,
      userContextType,
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
