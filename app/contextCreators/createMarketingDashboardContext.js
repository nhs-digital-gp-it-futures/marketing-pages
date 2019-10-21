export const createMarketingDashboardContext = (solutionId, dashboardManifest, marketingData) => {
  const context = {};
  const sectionGroups = [];

  context.previewUrl = `/${solutionId}/preview`;

  dashboardManifest.sectionGroups.map((manifestSectionGroup) => {
    const sectionGroup = {};
    const sections = [];

    sectionGroup.id = manifestSectionGroup.id;
    sectionGroup.title = manifestSectionGroup.title;

    manifestSectionGroup.sections.map((manifestSection) => {
      const section = {};
      section.URL = `/${solutionId}/section/${manifestSection.id}`;
      section.id = manifestSection.id;
      section.title = manifestSection.title;

      const { status, requirement } = marketingData.sections
        .find(marketingDataTask => marketingDataTask.id === manifestSection.id);
      section.status = status;
      section.requirement = requirement;

      sections.push(section);
    });

    sectionGroup.sections = sections;
    sectionGroups.push(sectionGroup);
  });

  context.sectionGroups = sectionGroups;

  return context;
};
