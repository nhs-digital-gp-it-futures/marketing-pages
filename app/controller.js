import { ManifestProvider } from './forms/manifestProvider';
import { createMarketingDashboardContext } from './contextCreator';

export const getMarketingPageDashboardContext = async () => {
  // Get manifest
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  // generate context from manifest
  const context = createMarketingDashboardContext(dashboardManifest);

  return context;
};
