import { createMarketingDataIfRequired, createUpdatedSolutionData } from './helpers';

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

      const existingMarketingData = {
        tasks: [
          {
            id: 'first-task',
            data: {},
            status: 'COMPLETE',
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

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingMarketingData,
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

      const existingMarketingData = {
        tasks: [
          {
            id: 'first-task',
            data: {},
            status: 'COMPLETE',
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

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingMarketingData,
      );

      expect(initialMarketingData).toEqual(expectedMarketingData);
    });
  });
});

describe('createUpdatedSolutionData', () => {
  it('should return updated solution data', () => {
    const expectedUpdatedSolutionData = {
      id: 'S100000-001',
      name: 'Write on Time',
      summary: 'Write on Time is a Citizen-facing Appointments Management system specifically designed to reduce the number of DNAs in your practice.',
      marketingData: {
        tasks: [
          {
            id: 'features',
            data: {
              'features-listing': [
                'Feature A',
                'Feature B',
                'Feature C',
              ],
            },
            status: 'COMPLETE',
          },
        ],
      },
    };

    const existingSolutionData = {
      id: 'S100000-001',
      name: 'Write on Time',
      summary: 'Write on Time is a Citizen-facing Appointments Management system specifically designed to reduce the number of DNAs in your practice.',
      marketingData: {
        tasks: [
          {
            id: 'features',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      },
    };

    const taskData = {
      'features-listing': [
        'Feature A',
        'Feature B',
        'Feature C',
      ],
    };

    const updatedSolutionData = createUpdatedSolutionData('features', existingSolutionData, taskData);

    expect(updatedSolutionData).toEqual(expectedUpdatedSolutionData);
  });
});
