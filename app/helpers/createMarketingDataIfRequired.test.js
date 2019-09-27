import { createMarketingDataIfRequired } from './createMarketingDataIfRequired';


describe('createMarketingDataIfRequired', () => {
  const createDashboardManifest = sectionGroups => ({
    id: 'marketing-page-dashboard',
    sectionGroups,
  });

  const createSection = (id, title, tasks) => ({
    id,
    title,
    tasks,
  });

  const createTask = (id, title) => ({
    id,
    title,
  });

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

      const dashboardManifest = createDashboardManifest(
        [
          createSection('first-section', 'The first section',
            [
              createTask('first-task', 'The first task'),
            ]),
        ],
      );

      const existingSolutionData = {};

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

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

      const dashboardManifest = createDashboardManifest(
        [
          createSection('first-section', 'The first section',
            [
              createTask('first-task', 'The first task'),
              createTask('second-task', 'The second task'),
            ]),
        ],
      );

      const existingSolutionData = {};

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });

    it('should create the inital marketing data for tasks with multiple sectionGroups', () => {
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

      const dashboardManifest = createDashboardManifest(
        [
          createSection('first-section', 'The first section',
            [
              createTask('first-task', 'The first task'),
              createTask('second-task', 'The second task'),
            ]),
          createSection('second-section', 'The second section',
            [
              createTask('third-task', 'The third task'),
            ]),
        ],
      );

      const existingSolutionData = {};

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });
  });

  describe('when there is existing marketing data', () => {
    it('should return the existing marketing data for the task', () => {
      const expectedMarketingData = {
        tasks: [
          {
            id: 'first-task',
            data: {},
            status: 'COMPLETE',
          },
        ],
      };

      const existingSolutionData = {
        marketingData: {
          tasks: [
            {
              id: 'first-task',
              data: {},
              status: 'COMPLETE',
            },
          ],
        },
      };

      const dashboardManifest = createDashboardManifest(
        [
          createSection('first-section', 'The first section',
            [
              createTask('first-task', 'The first task'),
            ]),
        ],
      );

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedMarketingData);
    });

    it('should return the existing marketing data for the task and initial marketing data for a task that does not exist', () => {
      const expectedMarketingData = {
        tasks: [
          {
            id: 'first-task',
            data: {},
            status: 'COMPLETE',
          },
          {
            id: 'second-task',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const existingSolutionData = {
        marketingData: {
          tasks: [
            {
              id: 'first-task',
              data: {},
              status: 'COMPLETE',
            },
          ],
        },
      };

      const dashboardManifest = createDashboardManifest(
        [
          createSection('first-section', 'The first section',
            [
              createTask('first-task', 'The first task'),
              createTask('second-task', 'The second task'),
            ]),
        ],
      );

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedMarketingData);
    });
  });
});
