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
      const subSections = [];

      const section = {};
      section.URL = `/${solutionId}/section/${manifestSection.id}`;
      section.id = manifestSection.id;
      section.title = manifestSection.title;

      const { status, requirement, sections: subSectionsData } = marketingData.sections
        .find(marketingDataTask => marketingDataTask.id === manifestSection.id);
      section.status = status;
      section.requirement = requirement;
      section.isActive = true;

      if (manifestSection.sections) {
        manifestSection.sections.map((manifestSubSection) => {
          const subSection = {};
          subSection.id = manifestSubSection.id;
          subSection.title = manifestSubSection.title;
          subSection.defaultMessage = manifestSubSection.defaultMessage;

          const foundSubSectionData = subSectionsData
            && subSectionsData.find(subSectionData => subSectionData.id === manifestSubSection.id);

          if (foundSubSectionData) {
            subSection.isActive = true;
            subSection.requirement = foundSubSectionData.requirement;
            subSection.status = foundSubSectionData.status;
          } else {
            subSection.isActive = false;
          }

          subSections.push(subSection);
        });
      }

      section.sections = subSections.length > 0 ? subSections : undefined;

      sections.push(section);
    });

    sectionGroup.sections = sections;
    sectionGroups.push(sectionGroup);
  });

  context.sectionGroups = sectionGroups;

  return context;
};
