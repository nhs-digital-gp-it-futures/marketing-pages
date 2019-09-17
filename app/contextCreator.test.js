import { createMarketingDashboardContext, createTaskPageContext } from './contextCreator';

describe('createMarketingDashboardContext', () => {
  it('should create a context from the manifest and the marketingData', () => {
    const expectedContext = {
      sections: [
        {
          id: 'about-your-solution',
          title: 'About your Solution',
          tasks: [
            {
              URL: '/some-solution-id/task/features',
              title: 'Features',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
            },
          ],
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
              requirement: 'Mandatory',
            },
          ],
        },
      ],
    };

    const marketingData = {
      tasks: [
        {
          id: 'features',
          data: {},
          status: 'INCOMPLETE',
        },
      ],
    };

    const context = createMarketingDashboardContext('some-solution-id', dashboardManifest, marketingData);

    expect(context).toEqual(expectedContext);
  });
});

describe('createTaskPageContext', () => {
  it('should create a context from the task manifest', () => {
    const expectedContext = {
      title: 'Features',
      questions: [
        {
          mainAdvice: 'Add up to 10 features that describe your Solution.',
          additionalAdvice: [
            'Each feature will be displayed as a bulleted list item. For example:',
            '- Create and change appointment entries',
            'You can enter up to 100 characters per feature',
          ],
        },
      ],
    };

    const taskManifest = {
      id: 'features',
      title: 'Features',
      questions: [
        {
          id: 'features-listing',
          mainAdvice: 'Add up to 10 features that describe your Solution.',
          additionalAdvice: [
            'Each feature will be displayed as a bulleted list item. For example:',
            '- Create and change appointment entries',
            'You can enter up to 100 characters per feature',
          ],
        },
      ],
    };

    const context = createTaskPageContext(taskManifest);

    expect(context).toEqual(expectedContext);
  });
});
