import axios from 'axios';
import { ManifestProvider } from '../../manifestProvider';
import { createDashboardPageContext } from '../createDashboardPageContext';
import { apiHost } from '../../config';

export const getSubDashboardPageContext = async (solutionId, sectionId) => {
  const dashboardManifest = new ManifestProvider().getSubDashboardManifest(sectionId);

  const sectionData = await axios.get(`${apiHost}/api/v1/Solutions/${solutionId}/sections/${sectionId}`);
  const { sections } = sectionData.data;

  const context = createDashboardPageContext(
    solutionId, dashboardManifest, sections,
  );

  return context;
};
