import { createMarketingDashboardContext } from './createMarketingDashboardContext';

describe('createMarketingDashboardContext', () => {
  it('should create a context from the manifest and the marketingData', () => {
    const expectedContext = {
      previewUrl: '/some-solution-id/preview',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/some-solution-id/section/some-section-id',
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
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              id: 'some-section-id',
              title: 'Some section',
            },
          ],
        },
      ],
    };

    const marketingDataSections = [
      {
        id: 'some-section-id',
        data: {},
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
      },
    ];

    const context = createMarketingDashboardContext('some-solution-id', dashboardManifest, marketingDataSections);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with sub sections from the manifest and no existing marketingData', () => {
    const expectedContext = {
      previewUrl: '/some-solution-id/preview',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/some-solution-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
              sections: [
                {
                  URL: '/some-solution-id/dashboard/some-first-sub-section-id',
                  id: 'some-first-sub-section-id',
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  isActive: false,
                },
                {
                  URL: '/some-solution-id/dashboard/some-second-sub-section-id',
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
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              id: 'some-section-id',
              title: 'Some section',
              sections: [
                {
                  id: 'some-first-sub-section-id',
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                },
                {
                  id: 'some-second-sub-section-id',
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                },
              ],
            },
          ],
        },
      ],
    };

    const marketingDataSections = [
      {
        id: 'some-section-id',
        data: {},
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
      },
    ];


    const context = createMarketingDashboardContext('some-solution-id', dashboardManifest, marketingDataSections);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with sub sections from the manifest and with existing marketingData', () => {
    const expectedContext = {
      previewUrl: '/some-solution-id/preview',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/some-solution-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
              sections: [
                {
                  URL: '/some-solution-id/dashboard/some-first-sub-section-id',
                  id: 'some-first-sub-section-id',
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                  isActive: false,
                },
                {
                  URL: '/some-solution-id/dashboard/some-second-sub-section-id',
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
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              id: 'some-section-id',
              title: 'Some section',
              sections: [
                {
                  id: 'some-first-sub-section-id',
                  title: 'Some first sub section',
                  defaultMessage: 'some default message',
                },
                {
                  id: 'some-second-sub-section-id',
                  title: 'Some second sub section',
                  defaultMessage: 'some default message',
                },
              ],
            },
          ],
        },
      ],
    };

    const marketingDataSections = [
      {
        id: 'some-section-id',
        data: {},
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
        sections: [
          {
            id: 'some-second-sub-section-id',
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
        ],
      },
    ];

    const context = createMarketingDashboardContext('some-solution-id', dashboardManifest, marketingDataSections);

    expect(context).toEqual(expectedContext);
  });
});
