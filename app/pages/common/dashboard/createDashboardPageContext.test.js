import { createDashboardPageContext } from './createDashboardPageContext';

describe('createDashboardPageContext', () => {
  describe('when the userContextType is supplier', () => {
    it('should create a context from the manifest and the marketingData', () => {
      const expectedContext = {
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
        sectionGroups: [
          {
            id: 'some-section-group-id',
            title: 'Some section group',
            sections: [
              {
                URL: '/supplier/solution/some-solution-id/section/some-section-id',
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

      const context = createDashboardPageContext({ solutionId: 'some-solution-id', dashboardManifest, marketingDataSections });

      expect(context).toEqual(expectedContext);
    });

    it('should create a context with sub sections from the manifest and no existing marketingData', () => {
      const expectedContext = {
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
        sectionGroups: [
          {
            id: 'some-section-group-id',
            title: 'Some section group',
            sections: [
              {
                URL: '/supplier/solution/some-solution-id/section/some-section-id',
                id: 'some-section-id',
                title: 'Some section',
                requirement: 'Mandatory',
                status: 'INCOMPLETE',
                isActive: true,
                sections: [
                  {
                    URL: '/supplier/solution/some-solution-id/dashboard/some-first-sub-section-id',
                    id: 'some-first-sub-section-id',
                    title: 'Some first sub section',
                    defaultMessage: 'some default message',
                    isActive: false,
                  },
                  {
                    URL: '/supplier/solution/some-solution-id/dashboard/some-second-sub-section-id',
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

      const context = createDashboardPageContext({ solutionId: 'some-solution-id', dashboardManifest, marketingDataSections });

      expect(context).toEqual(expectedContext);
    });

    it('should create a context with sub sections from the manifest and with existing marketingData', () => {
      const expectedContext = {
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
        sectionGroups: [
          {
            id: 'some-section-group-id',
            title: 'Some section group',
            sections: [
              {
                URL: '/supplier/solution/some-solution-id/section/some-section-id',
                id: 'some-section-id',
                title: 'Some section',
                requirement: 'Mandatory',
                status: 'INCOMPLETE',
                isActive: true,
                sections: [
                  {
                    URL: '/supplier/solution/some-solution-id/dashboard/some-first-sub-section-id',
                    id: 'some-first-sub-section-id',
                    title: 'Some first sub section',
                    defaultMessage: 'some default message',
                    isActive: false,
                  },
                  {
                    URL: '/supplier/solution/some-solution-id/dashboard/some-second-sub-section-id',
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

      const context = createDashboardPageContext({ solutionId: 'some-solution-id', dashboardManifest, marketingDataSections });

      expect(context).toEqual(expectedContext);
    });

    it('should create a context from the manifest, marketingData and any validationErrors', () => {
      const expectedContext = {
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
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
                URL: '/supplier/solution/some-solution-id/section/some-section-id',
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

      const context = createDashboardPageContext({
        solutionId: 'some-solution-id', dashboardManifest, marketingDataSections, validationErrors,
      });

      expect(context).toEqual(expectedContext);
    });

    it('should create a context with sub sections from the manifest and validationErrors', () => {
      const expectedContext = {
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
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
                URL: '/supplier/solution/some-solution-id/section/some-section-id',
                id: 'some-section-id',
                title: 'Some section',
                requirement: 'Mandatory',
                status: 'INCOMPLETE',
                isActive: true,
                sections: [
                  {
                    URL: '/supplier/solution/some-solution-id/dashboard/some-first-sub-section-id',
                    id: 'some-first-sub-section-id',
                    title: 'Some first sub section',
                    defaultMessage: 'some default message',
                    isActive: true,
                    requirement: 'Mandatory',
                    status: 'INCOMPLETE',
                  },
                  {
                    URL: '/supplier/solution/some-solution-id/dashboard/some-second-sub-section-id',
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

      const context = createDashboardPageContext({
        solutionId: 'some-solution-id', dashboardManifest, marketingDataSections, validationErrors,
      });

      expect(context).toEqual(expectedContext);
    });

    it('should create a context with the url of the sub section containing the dashboard id', () => {
      const expectedContext = {
        title: 'Sub Dashboard',
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
        sectionGroups: [
          {
            id: 'sub-dashboard-sections',
            title: 'sub dashboard sections',
            sections: [
              {
                URL: '/supplier/solution/some-solution-id/dashboard/some-sub-dashboard/section/sub-section-one',
                id: 'sub-section-one',
                title: 'Sub section one',
                isActive: false,
              },
              {
                URL: '/supplier/solution/some-solution-id/dashboard/some-sub-dashboard/section/sub-section-two',
                id: 'sub-section-two',
                title: 'Sub section two',
                isActive: false,
              },
              {
                URL: '/supplier/solution/some-solution-id/dashboard/some-sub-dashboard/section/sub-section-three',
                id: 'sub-section-three',
                title: 'Sub section three',
                isActive: false,
              },
            ],
          },
        ],
      };

      const dashboardManifest = {
        id: 'some-sub-dashboard-page',
        title: 'Sub Dashboard',
        sectionGroups: {
          'sub-dashboard-sections': {
            title: 'sub dashboard sections',
            sections: {
              'sub-section-one': {
                title: 'Sub section one',
                type: 'section',
              },
              'sub-section-two': {
                title: 'Sub section two',
                type: 'section',
              },
              'sub-section-three': {
                title: 'Sub section three',
                type: 'section',
              },
            },
          },
        },
      };

      const context = createDashboardPageContext({ solutionId: 'some-solution-id', dashboardManifest, dashboardId: 'some-sub-dashboard' });

      expect(context).toEqual(expectedContext);
    });

    it('should create a context with the url of the section without the dashboard id when not provided', () => {
      const expectedContext = {
        title: 'Dashboard',
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
        sectionGroups: [
          {
            id: 'dashboard-sections',
            title: 'dashboard sections',
            sections: [
              {
                URL: '/supplier/solution/some-solution-id/section/section-one',
                id: 'section-one',
                title: 'section one',
                isActive: false,
              },
              {
                URL: '/supplier/solution/some-solution-id/section/section-two',
                id: 'section-two',
                title: 'section two',
                isActive: false,
              },
              {
                URL: '/supplier/solution/some-solution-id/section/section-three',
                id: 'section-three',
                title: 'section three',
                isActive: false,
              },
            ],
          },
        ],
      };

      const dashboardManifest = {
        id: 'some-dashboard-page',
        title: 'Dashboard',
        sectionGroups: {
          'dashboard-sections': {
            title: 'dashboard sections',
            sections: {
              'section-one': {
                title: 'section one',
                type: 'section',
              },
              'section-two': {
                title: 'section two',
                type: 'section',
              },
              'section-three': {
                title: 'section three',
                type: 'section',
              },
            },
          },
        },
      };

      const context = createDashboardPageContext({ solutionId: 'some-solution-id', dashboardManifest });

      expect(context).toEqual(expectedContext);
    });
  });

  describe('when the userContextType is authority', () => {
    it('should create a context from the manifest and the marketingData', () => {
      const expectedContext = {
        returnToDashboardUrl: '/authority/solution/some-solution-id',
        previewUrl: '/authority/solution/some-solution-id/preview',
        sectionGroups: [
          {
            id: 'some-section-group-id',
            title: 'Some section group',
            sections: [
              {
                URL: '/authority/solution/some-solution-id/section/some-section-id',
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

      const context = createDashboardPageContext({
        solutionId: 'some-solution-id', dashboardManifest, marketingDataSections, userContextType: 'authority',
      });

      expect(context).toEqual(expectedContext);
    });
  });
});
