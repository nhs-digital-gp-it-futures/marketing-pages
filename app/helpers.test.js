import { createInitialMarketingData } from './helpers';

describe('createInitialMarketingData', () => {
  it('should create the inital marketing data for 1 task marked as incomplete', () => {
    const expectedInitialMarketingData = {
      tasks: [
        {
          id: 'features',
          data: {},
          status: 'INCOMPLETE',
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

    const initialMarketingData = createInitialMarketingData(dashboardManifest);

    expect(initialMarketingData).toEqual(expectedInitialMarketingData);
  });
});
