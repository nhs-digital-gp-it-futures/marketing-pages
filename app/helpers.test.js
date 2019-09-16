import { createMarketingDataIfRequired } from './helpers';

describe('createMarketingDataIfRequired', () => {
  describe('when initial load and no marketing data exists', () => {
    it('should create the inital marketing data for 1 task', () => {
      const expectedInitialMarketingData = {
        tasks: [
          {
            id: 'first-task',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const dashboardManifest = {
        id: 'marketing-page-dashboard',
        sections: [
          {
            id: 'first-section',
            title: 'The first section',
            tasks: [
              {
                id: 'first-task',
                title: 'The first task',
              },
            ],
          },
        ],
      };

      const initialMarketingData = createMarketingDataIfRequired(dashboardManifest);

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });

    it('should create the inital marketing data for 2 tasks', () => {
      const expectedInitialMarketingData = {
        tasks: [
          {
            id: 'first-task',
            data: {},
            status: 'INCOMPLETE',
          },
          {
            id: 'second-task',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const dashboardManifest = {
        id: 'marketing-page-dashboard',
        sections: [
          {
            id: 'first-section',
            title: 'The first section',
            tasks: [
              {
                id: 'first-task',
                title: 'The first task',
              },
              {
                id: 'second-task',
                title: 'The second task',
              },
            ],
          },
        ],
      };

      const initialMarketingData = createMarketingDataIfRequired(dashboardManifest);

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });

    it('should create the inital marketing data for tasks with multiple sections', () => {
      const expectedInitialMarketingData = {
        tasks: [
          {
            id: 'first-task',
            data: {},
            status: 'INCOMPLETE',
          },
          {
            id: 'second-task',
            data: {},
            status: 'INCOMPLETE',
          },
          {
            id: 'third-task',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const dashboardManifest = {
        id: 'marketing-page-dashboard',
        sections: [
          {
            id: 'first-section',
            title: 'The first section',
            tasks: [
              {
                id: 'first-task',
                title: 'The first task',
              },
              {
                id: 'second-task',
                title: 'The second task',
              },
            ],
          },
          {
            id: 'second-section',
            title: 'The second section',
            tasks: [
              {
                id: 'third-task',
                title: 'The third task',
              },
            ],
          },
        ],
      };

      const initialMarketingData = createMarketingDataIfRequired(dashboardManifest);

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });
  });
});
