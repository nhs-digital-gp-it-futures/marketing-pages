import { ErrorContext, getData, putData } from 'buying-catalogue-library';
import { getDashboardManifest } from '../../../manifestProvider';
import { createDashboardPageContext } from './createDashboardPageContext';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getMarketingPageDashboardContext = async ({
  solutionId, validationErrors, userContextType = 'supplier',
}) => {
  const dashboardManifest = getDashboardManifest({ userContextType });
  const endpoint = getEndpoint({ endpointLocator: 'getMainDashboardData', options: { solutionId, userContextType } });
  const dashboardData = await getData({ endpoint, logger });

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
  throw new ErrorContext({
    status: 404,
    description: 'No data returned',
  });
};

export const postSubmitForModeration = async ({ solutionId }) => {
  try {
    const endpoint = getEndpoint({ endpointLocator: 'putSubmitForModeration', options: { solutionId } });
    await putData({ endpoint, logger });
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};
