import { ErrorContext, getData } from 'buying-catalogue-library';
import { getSubDashboardManifest } from '../../../../manifestProvider';
import { createDashboardPageContext } from '../../../common/dashboard/createDashboardPageContext';
import { logger } from '../../../../logger';
import { getEndpoint } from '../../../../endpoints';

export const getSubDashboardPageContext = async ({ solutionId, dashboardId }) => {
  const dashboardManifest = getSubDashboardManifest({ dashboardId });
  const endpoint = getEndpoint({ endpointLocator: 'getSubDashboardData', options: { solutionId, dashboardId } });
  const sectionData = await getData({ endpoint, logger });

  if (sectionData) {
    const context = createDashboardPageContext({
      solutionId,
      dashboardManifest,
      marketingDataSections: sectionData.sections,
      dashboardId,
    });
    return context;
  }
  throw new ErrorContext({
    status: 404,
    description: 'No data returned',
  });
};
