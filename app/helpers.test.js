import { createMarketingDataIfRequired } from './helpers';

describe('createMarketingDataIfRequired', () => {
  const createDashboardManifest = sections => ({
    id: 'marketing-page-dashboard',
    sections,
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

      const dashboardManifest = createDashboardManifest(
        [
          createSection('first-section', 'The first section',
            [
              createTask('first-task', 'The first task'),
              createTask('second-task', 'The second task'),
            ]),
        ],
      );

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

      const initialMarketingData = createMarketingDataIfRequired(dashboardManifest);

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });
  });
});
