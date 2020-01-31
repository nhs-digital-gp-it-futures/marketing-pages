import { ManifestProvider } from '../../../../manifestProvider';
import { ApiProvider } from '../../../../apiProvider';
import { createDashboardPageContext } from '../createDashboardPageContext';

export const getSubDashboardPageContext = async ({ solutionId, dashboardId }) => {
  const dashboardManifest = new ManifestProvider().getSubDashboardManifest({ dashboardId });
  const sectionData = await new ApiProvider().getSubDashboardData({ solutionId, dashboardId });

  if (sectionData && sectionData.data) {
    const { sections } = sectionData.data;
    const context = createDashboardPageContext({
      solutionId,
      dashboardManifest,
      marketingDataSections: sections,
      dashboardId,
    });
    return context;
  }
  throw new Error('No data returned');
};
