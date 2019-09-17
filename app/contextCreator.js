export const createMarketingDashboardContext = (solutionId, dashboardManifest, marketingData) => {
  const context = {};
  const sections = [];

  dashboardManifest.sections.map((manifestSection) => {
    const section = {};
    const tasks = [];

    section.id = manifestSection.id;
    section.title = manifestSection.title;

    manifestSection.tasks.map((manifestTask) => {
      const task = {};
      task.URL = `/${solutionId}/task/${manifestTask.id}`;
      task.title = manifestTask.title;
      task.requirement = manifestTask.requirement;

      const { status } = marketingData.tasks
        .find(marketingDataTask => marketingDataTask.id === manifestTask.id);
      task.status = status;

      tasks.push(task);
    });

    section.tasks = tasks;
    sections.push(section);
  });

  context.sections = sections;

  return context;
};

export const createTaskPageContext = () => {
  const context = {
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

  return context;
};
