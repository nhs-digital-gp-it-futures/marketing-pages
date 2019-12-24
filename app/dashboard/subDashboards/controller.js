import axios from 'axios';
import { ManifestProvider } from '../../manifestProvider';
import { createDashboardPageContext } from '../createDashboardPageContext';
import logger from '../../logger';
import { apiHost } from '../../config';

export const getSubDashboardPageContext = async (solutionId, dashboardId) => {
  const dashboardManifest = new ManifestProvider().getSubDashboardManifest(dashboardId);

  const endpoint = `${apiHost}/api/v1/Solutions/${solutionId}/dashboards/${dashboardId}`;
  logger.info(`api called: [GET] ${endpoint}`);
  const sectionData = await axios.get(endpoint);
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
