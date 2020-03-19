import { ManifestProvider } from '../../../manifestProvider';
import { getData, putData } from '../../../apiProvider2';
import { createDashboardPageContext } from './createDashboardPageContext';

export const getMarketingPageDashboardContext = async ({
  solutionId, validationErrors, userContextType = 'supplier',
}) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest({ userContextType });
  const dashboardData = await getData({ endpointLocator: 'getMainDashboardData', options: { solutionId, userContextType } });

  if (dashboardData) {
    const context = createDashboardPageContext({
      solutionId,
      solutionName: dashboardData.name,
      supplierName: dashboardData['supplier-name'],
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
    await putData({ endpointLocator: 'putSubmitForModeration', options: { solutionId } });
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};
