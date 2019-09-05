import { ManifestProvider } from './forms/manifestProvider';
import { createMarketingDashboardContext } from './contextCreator';

export const getMarketingPageDashboardContext = async () => {
  // Get manifest
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  // generate context from manifest
  const context = createMarketingDashboardContext(dashboardManifest);

  // const context = {
  //   section: {
  //     id: 'about-your-solution',
  //     name: 'About your Solution',
  //     task: [
  //       {
  //         URL: 'features',
  //         title: 'Features',
  //         requirement: 'Optional',
  //         status: 'complete',
  //       },
  //     ],
  //   },
  // };
  return context;
};
