const createSectionGroupContext = (manifestSectionGroup) => {
  const sectionGroup = {
    id: manifestSectionGroup.id,
    title: manifestSectionGroup.title,
  };

  return sectionGroup;
};

const createSubSectionsContext = (solutionId, manifestSection, subSectionsData) => {
  const subSections = [];

  if (manifestSection.sections) {
    manifestSection.sections.map((manifestSubSection) => {
      const foundSubSectionData = subSectionsData
        && subSectionsData.find(subSectionData => subSectionData.id === manifestSubSection.id);

      const subSection = {
        URL: `/${solutionId}/dashboard/${manifestSubSection.id}`,
        id: manifestSubSection.id,
        title: manifestSubSection.title,
        defaultMessage: manifestSubSection.defaultMessage,
        isActive: !!foundSubSectionData,
        requirement: foundSubSectionData ? foundSubSectionData.requirement : undefined,
        status: foundSubSectionData ? foundSubSectionData.status : undefined,
      };

      subSections.push(subSection);
    });
  }

  return subSections.length > 0 ? subSections : undefined;
};

const createSectionContext = (solutionId, manifestSection, marketingDataSections) => {
  const { status, requirement, sections: subSectionsData } = marketingDataSections
    .find(marketingDataTask => marketingDataTask.id === manifestSection.id);

  const section = {
    URL: `/${solutionId}/section/${manifestSection.id}`,
    id: manifestSection.id,
    title: manifestSection.title,
    status,
    requirement,
    isActive: true,
    sections: createSubSectionsContext(solutionId, manifestSection, subSectionsData),
  };

  return section;
};

export const createDashboardPageContext = (
  solutionId, dashboardManifest, marketingDataSections,
) => {
  const context = {
    title: dashboardManifest.title,
    mainAdvice: dashboardManifest.mainAdvice,
    additionalAdvice: dashboardManifest.additionalAdvice,
    previewUrl: `/${solutionId}/preview`,
    submitForModerationUrl: `/${solutionId}/submitForModeration`,
    returnToDashboardUrl: `/${solutionId}`,
  };
  const sectionGroups = [];

  dashboardManifest.sectionGroups.map((manifestSectionGroup) => {
    const sections = [];

    const sectionGroup = createSectionGroupContext(manifestSectionGroup);

    manifestSectionGroup.sections.map((manifestSection) => {
      const section = createSectionContext(solutionId, manifestSection, marketingDataSections);

      sections.push(section);
    });

    sectionGroup.sections = sections;
    sectionGroups.push(sectionGroup);
  });

  context.sectionGroups = sectionGroups;

  return context;
};
