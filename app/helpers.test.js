import { createUpdatedSolutionData } from './helpers';

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
