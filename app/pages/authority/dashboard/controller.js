import { ManifestProvider } from '../../../manifestProvider';
import { ApiProvider } from '../../../apiProvider';
import { createDashboardPageContext } from '../../common/dashboard/createDashboardPageContext';

export const getAuthorityMarketingPageDashboardContext = async (
  { solutionId, validationErrors }) => {
  const dashboardManifest = new ManifestProvider().getAuthorityDashboardManifest();
  const dashboardDataRaw = await new ApiProvider().getAuthorityMainDashboardData({ solutionId });

  if (dashboardDataRaw && dashboardDataRaw.data) {
    const dashboardData = dashboardDataRaw.data;
    const context = createDashboardPageContext({
      solutionId,
      dashboardManifest,
      marketingDataSections: dashboardData.sections,
      validationErrors,
      userContextType: 'authority',
    });
    return context;
  }
  throw new Error('No data returned');
};
