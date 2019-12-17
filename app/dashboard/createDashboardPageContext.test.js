import { createDashboardPageContext } from './createDashboardPageContext';

describe('createDashboardPageContext', () => {
  it('should create a context from the manifest and the marketingData', () => {
    const expectedContext = {
      previewUrl: '/solution/some-solution-id/preview',
      submitForModerationUrl: '/solution/some-solution-id/submitForModeration',
      returnToDashboardUrl: '/solution/some-solution-id',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/solution/some-solution-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
            },
          ],
        },
      ],
    };

    const dashboardManifest = {
      id: 'marketing-page-dashboard',
      sectionGroups: {
        'some-section-group-id': {
          title: 'Some section group',
          sections: {
            'some-section-id': {
              title: 'Some section',
              type: 'section',
            },
          },
        },
      },
    };

    const marketingDataSections = {
      'some-section-id': {
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
      },
    };

    const context = createDashboardPageContext('some-solution-id', dashboardManifest, marketingDataSections);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with sub sections from the manifest and no existing marketingData', () => {
    const expectedContext = {
      previewUrl: '/solution/some-solution-id/preview',
      submitForModerationUrl: '/solution/some-solution-id/submitForModeration',
      returnToDashboardUrl: '/solution/some-solution-id',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/solution/some-solution-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
              sections: [
                {
                  URL: '/solution/some-solution-id/dashboard/some-first-sub-section-id',
                  id: 'some-first-sub-section-id',
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  isActive: false,
                },
                {
                  URL: '/solution/some-solution-id/dashboard/some-second-sub-section-id',
                  id: 'some-second-sub-section-id',
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                  isActive: false,
                },
              ],
            },
          ],
        },
      ],
    };

    const dashboardManifest = {
      id: 'marketing-page-dashboard',
      sectionGroups: {
        'some-section-group-id': {
          title: 'Some section group',
          sections: {
            'some-section-id': {
              title: 'Some section',
              type: 'section',
              sections: {
                'some-first-sub-section-id': {
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  type: 'dashboard',
                },
                'some-second-sub-section-id': {
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                  type: 'dashboard',
                },
              },
            },
          },
        },
      },
    };

    const marketingDataSections = {
      'some-section-id': {
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
      },
    };


    const context = createDashboardPageContext('some-solution-id', dashboardManifest, marketingDataSections);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with sub sections from the manifest and with existing marketingData', () => {
    const expectedContext = {
      previewUrl: '/solution/some-solution-id/preview',
      submitForModerationUrl: '/solution/some-solution-id/submitForModeration',
      returnToDashboardUrl: '/solution/some-solution-id',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/solution/some-solution-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
              sections: [
                {
                  URL: '/solution/some-solution-id/dashboard/some-first-sub-section-id',
                  id: 'some-first-sub-section-id',
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  isActive: false,
                },
                {
                  URL: '/solution/some-solution-id/dashboard/some-second-sub-section-id',
                  id: 'some-second-sub-section-id',
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                  isActive: true,
                  requirement: 'Mandatory',
                  status: 'INCOMPLETE',
                },
              ],
            },
          ],
        },
      ],
    };

    const dashboardManifest = {
      id: 'marketing-page-dashboard',
      sectionGroups: {
        'some-section-group-id': {
          title: 'Some section group',
          sections: {
            'some-section-id': {
              title: 'Some section',
              type: 'section',
              sections: {
                'some-first-sub-section-id': {
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  type: 'dashboard',
                },
                'some-second-sub-section-id': {
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                  type: 'dashboard',
                },
              },
            },
          },
        },
      },
    };

    const marketingDataSections = {
      'some-section-id': {
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
        sections: {
          'some-second-sub-section-id': {
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
        },
      },
    };

    const context = createDashboardPageContext('some-solution-id', dashboardManifest, marketingDataSections);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the manifest, marketingData and any validationErrors', () => {
    const expectedContext = {
      previewUrl: '/solution/some-solution-id/preview',
      submitForModerationUrl: '/solution/some-solution-id/submitForModeration',
      returnToDashboardUrl: '/solution/some-solution-id',
      errors: [
        {
          text: 'some-section-id is a required section',
          href: '#some-section-id',
        },
      ],
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/solution/some-solution-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
            },
          ],
        },
      ],
    };

    const dashboardManifest = {
      id: 'marketing-page-dashboard',
      sectionGroups: {
        'some-section-group-id': {
          title: 'Some section group',
          type: 'section',
          sections: {
            'some-section-id': {
              title: 'Some section',
              type: 'section',
              errorResponse: {
                required: 'some-section-id is a required section',
              },
            },
          },
        },
      },
    };

    const marketingDataSections = {
      'some-section-id': {
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
      },
    };

    const validationErrors = {
      required: ['some-section-id'],
    };

    const context = createDashboardPageContext('some-solution-id', dashboardManifest, marketingDataSections, validationErrors);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with sub sections from the manifest and validationErrors', () => {
    const expectedContext = {
      previewUrl: '/solution/some-solution-id/preview',
      submitForModerationUrl: '/solution/some-solution-id/submitForModeration',
      returnToDashboardUrl: '/solution/some-solution-id',
      errors: [
        {
          text: 'some-first-sub-section-id is a required sub section',
          href: '#some-first-sub-section-id',
        },
      ],
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/solution/some-solution-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
              sections: [
                {
                  URL: '/solution/some-solution-id/dashboard/some-first-sub-section-id',
                  id: 'some-first-sub-section-id',
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  isActive: true,
                  requirement: 'Mandatory',
                  status: 'INCOMPLETE',
                },
                {
                  URL: '/solution/some-solution-id/dashboard/some-second-sub-section-id',
                  id: 'some-second-sub-section-id',
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                  isActive: false,
                },
              ],
            },
          ],
        },
      ],
    };

    const dashboardManifest = {
      id: 'marketing-page-dashboard',
      sectionGroups: {
        'some-section-group-id': {
          title: 'Some section group',
          sections: {
            'some-section-id': {
              title: 'Some section',
              type: 'section',
              sections: {
                'some-first-sub-section-id': {
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  type: 'dashboard',
                  errorResponse: {
                    required: 'some-first-sub-section-id is a required sub section',
                  },
                },
                'some-second-sub-section-id': {
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                  type: 'dashboard',
                },
              },
            },
          },
        },
      },
    };

    const marketingDataSections = {
      'some-section-id': {
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
        sections: {
          'some-first-sub-section-id': {
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
        },
      },
    };

    const validationErrors = {
      required: ['some-first-sub-section-id'],
    };

    const context = createDashboardPageContext('some-solution-id', dashboardManifest, marketingDataSections, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});
