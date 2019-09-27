export const createMarketingDashboardContext = (solutionId, dashboardManifest, marketingData) => {
  const context = {};
  const sectionGroups = [];

  dashboardManifest.sectionGroups.map((manifestSection) => {
    const sectionGroup = {};
    const sections = [];

    sectionGroup.id = manifestSection.id;
    sectionGroup.title = manifestSection.title;

    manifestSection.sections.map((manifestTask) => {
      const task = {};
      task.URL = `/${solutionId}/task/${manifestTask.id}`;
      task.title = manifestTask.title;
      task.requirement = manifestTask.requirement;

      const { status } = marketingData.sections
        .find(marketingDataTask => marketingDataTask.id === manifestTask.id);
      task.status = status;

      sections.push(task);
    });

    sectionGroup.sections = sections;
    sectionGroups.push(sectionGroup);
  });

  context.sectionGroups = sectionGroups;

  return context;
};
