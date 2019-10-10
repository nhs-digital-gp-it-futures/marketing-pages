import { createUpdatedSolutionData } from './createUpdatedSolutionData';

describe('createUpdatedSolutionData', () => {
  it('should return the solution data as is if the section can not be found', () => {
    const existingSolutionData = {
      id: 'S100000-001',
      name: 'Write on Time',
      summary: 'Write on Time is a Citizen-facing Appointments Management system specifically designed to reduce the number of DNAs in your practice.',
      marketingData: {
        sections: [
          {
            id: 'features',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      },
    };

    const sectionManifest = {
      id: 'features',
      title: 'Features',
      questions: [
        {
          id: 'features-listing',
          type: 'bulletpoint-list',
          requirement: 'Optional',
        },
      ],
    };

    const sectionData = {
      'features-listing': [
        'Feature A',
        'Feature B',
        'Feature C',
      ],
    };

    const updatedSolutionData = createUpdatedSolutionData('some-other-section-id', existingSolutionData, sectionManifest, sectionData);

    expect(updatedSolutionData).toEqual(existingSolutionData);
  });

  it('should return updated solution data', () => {
    const expectedUpdatedSolutionData = {
      id: 'S100000-001',
      name: 'Write on Time',
      summary: 'Write on Time is a Citizen-facing Appointments Management system specifically designed to reduce the number of DNAs in your practice.',
      marketingData: {
        sections: [
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
        sections: [
          {
            id: 'features',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      },
    };

    const sectionManifest = {
      id: 'features',
      title: 'Features',
      questions: [
        {
          id: 'features-listing',
          type: 'bulletpoint-list',
          requirement: 'Optional',
        },
      ],
    };

    const sectionData = {
      'features-listing': [
        'Feature A',
        'Feature B',
        'Feature C',
      ],
    };

    const updatedSolutionData = createUpdatedSolutionData('features', existingSolutionData, sectionManifest, sectionData);

    expect(updatedSolutionData).toEqual(expectedUpdatedSolutionData);
  });

  it('should return updated solution data with blank data and status as INCOMPLETE if the data has been removed in the secitonData', () => {
    const expectedUpdatedSolutionData = {
      id: 'S100000-001',
      name: 'Write on Time',
      summary: 'Write on Time is a Citizen-facing Appointments Management system specifically designed to reduce the number of DNAs in your practice.',
      marketingData: {
        sections: [
          {
            id: 'features',
            data: {
              'features-listing': [
                '',
                '',
                '',
              ],
            },
            status: 'INCOMPLETE',
          },
        ],
      },
    };

    const existingSolutionData = {
      id: 'S100000-001',
      name: 'Write on Time',
      summary: 'Write on Time is a Citizen-facing Appointments Management system specifically designed to reduce the number of DNAs in your practice.',
      marketingData: {
        sections: [
          {
            id: 'features',
            data: {
              'features-listing': [
                'Feature A',
                'Feature B',
                'Feature C',
              ],
            },
            status: 'INCOMPLETE',
          },
        ],
      },
    };

    const sectionManifest = {
      id: 'features',
      title: 'Features',
      questions: [
        {
          id: 'features-listing',
          type: 'bulletpoint-list',
          requirement: 'Optional',
        },
      ],
    };

    const sectionData = {
      'features-listing': [
        '',
        '',
        '',
      ],
    };

    const updatedSolutionData = createUpdatedSolutionData('features', existingSolutionData, sectionManifest, sectionData);

    expect(updatedSolutionData).toEqual(expectedUpdatedSolutionData);
  });

  describe('when the section being updated is the solution description', () => {
    it('should return updated solution data and also update the description, summary and aboutUrl properties', () => {
      const expectedUpdatedSolutionData = {
        id: 'S100000-001',
        name: 'Write on Time',
        summary: 'The added Solution summary details',
        description: 'The added Solution description details',
        aboutUrl: 'The added Solution about url details',
        marketingData: {
          sections: [
            {
              id: 'solution-description',
              data: {
                'solution-summary': 'The added Solution summary details',
                'solution-description': 'The added Solution description details',
                'solution-link': 'The added Solution about url details',
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
          sections: [
            {
              id: 'solution-description',
              data: {},
              status: 'INCOMPLETE',
            },
          ],
        },
      };

      const sectionManifest = {
        id: 'solution-description',
        title: 'Solution description',
        questions: [
          {
            id: 'solution-summary',
            type: 'textarea-field',
            requirement: 'Mandatory',
          },
          {
            id: 'solution-description',
            type: 'textarea-field',
            requirement: 'Optional',
          },
          {
            id: 'solution-link',
            type: 'textfield',
            requirement: 'Optional',
          },
        ],
      };

      const sectionData = {
        'solution-summary': 'The added Solution summary details',
        'solution-description': 'The added Solution description details',
        'solution-link': 'The added Solution about url details',
      };

      const updatedSolutionData = createUpdatedSolutionData('solution-description', existingSolutionData, sectionManifest, sectionData);

      expect(updatedSolutionData).toEqual(expectedUpdatedSolutionData);
    });
  });
});
