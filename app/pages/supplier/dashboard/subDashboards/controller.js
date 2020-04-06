import { getSubDashboardManifest } from '../../../../manifestProvider';
import { getData } from '../../../../apiProvider';
import { createDashboardPageContext } from '../../../common/dashboard/createDashboardPageContext';

export const getSubDashboardPageContext = async ({ solutionId, dashboardId }) => {
  const dashboardManifest = await getSubDashboardManifest({ dashboardId });
  const sectionData = await getData({ endpointLocator: 'getSubDashboardData', options: { solutionId, dashboardId } });

  if (sectionData) {
    const context = createDashboardPageContext({
      solutionId,
      dashboardManifest,
      marketingDataSections: sectionData.sections,
      dashboardId,
    });
    return context;
  }
  throw new Error('No data returned');
};
