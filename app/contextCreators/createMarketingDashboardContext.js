export const createMarketingDashboardContext = (solutionId, dashboardManifest, marketingData) => {
  const context = {};
  const sectionGroups = [];

  dashboardManifest.sectionGroups.map((manifestSection) => {
    const sectionGroup = {};
    const tasks = [];

    sectionGroup.id = manifestSection.id;
    sectionGroup.title = manifestSection.title;

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

    sectionGroup.tasks = tasks;
    sectionGroups.push(sectionGroup);
  });

  context.sectionGroups = sectionGroups;

  return context;
};
