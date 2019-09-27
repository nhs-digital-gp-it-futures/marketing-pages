import { createMarketingDashboardContext } from './createMarketingDashboardContext';

describe('createMarketingDashboardContext', () => {
  it('should create a context from the manifest and the marketingData', () => {
    const expectedContext = {
      sectionGroups: [
        {
          id: 'about-your-solution',
          title: 'About your Solution',
          tasks: [
            {
              URL: '/some-solution-id/task/features',
              title: 'Features',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
            },
          ],
        },
      ],
    };

    const dashboardManifest = {
      id: 'marketing-page-dashboard',
      sectionGroups: [
        {
          id: 'about-your-solution',
          title: 'About your Solution',
          tasks: [
            {
              id: 'features',
              title: 'Features',
              requirement: 'Mandatory',
            },
          ],
        },
      ],
    };

    const marketingData = {
      tasks: [
        {
          id: 'features',
          data: {},
          status: 'INCOMPLETE',
        },
      ],
    };

    const context = createMarketingDashboardContext('some-solution-id', dashboardManifest, marketingData);

    expect(context).toEqual(expectedContext);
  });
});
