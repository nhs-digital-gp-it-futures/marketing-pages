import { createMarketingDashboardContext } from './contextCreator';

describe('createMarketingDashboardContext', () => {
  it('should create a context from the manifest', () => {
    const expectedContext = {
      sections: [
        {
          id: 'about-your-solution',
          title: 'About your Solution',
          tasks: [
            {
              URL: 'features',
              title: 'Features',
            },
          ],
        },
      ],
    };

    const dashboardManifest = {
      id: 'marketing-page-dashboard',
      sections: [
        {
          id: 'about-your-solution',
          title: 'About your Solution',
          tasks: [
            {
              id: 'features',
              title: 'Features',
            },
          ],
        },
      ],
    };

    const context = createMarketingDashboardContext(dashboardManifest);

    expect(context).toEqual(expectedContext);
  });
});
