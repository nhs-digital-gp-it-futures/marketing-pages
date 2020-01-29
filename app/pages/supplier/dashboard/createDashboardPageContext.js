const addErrors = ({ manifestSectionId, manifestSection, validationErrors }) => {
  const addedErrors = [];

  if (validationErrors) {
    Object.entries(validationErrors).map(([errorType, erroredSections]) => {
      if (erroredSections.some(erroredSectionId => manifestSectionId === erroredSectionId)) {
        const error = {
          text: manifestSection.errorResponse[errorType],
          href: `#${manifestSectionId}`,
        };
        addedErrors.push(error);
      }
    });
  }

  return addedErrors;
};

const createSectionsContext = ({
  solutionId, manifestSections, marketingDataSections, validationErrors, dashboardId,
}) => {
  const { errorsAcc: errors, sectionsAcc: sections } = Object.entries(manifestSections)
    .reduce(({ errorsAcc, sectionsAcc }, [manifestSectionId, manifestSection]) => {
      const doesDataExistForSection = !!(marketingDataSections
        && marketingDataSections[manifestSectionId]);

      const { errors: subSectionErrors, sections: subSections } = manifestSection.sections
        ? createSectionsContext({
          solutionId,
          manifestSections: manifestSection.sections,
          marketingDataSections: marketingDataSections[manifestSectionId].sections,
          validationErrors,
        })
        : { errors: undefined, sections: undefined };

      const sectionPath = dashboardId
        ? `/supplier/solution/${solutionId}/dashboard/${dashboardId}/${manifestSection.type}/${manifestSectionId}`
        : `/supplier/solution/${solutionId}/${manifestSection.type}/${manifestSectionId}`;

      const sectionContext = {
        URL: sectionPath,
        id: manifestSectionId,
        title: manifestSection.title,
        status: doesDataExistForSection
          ? marketingDataSections[manifestSectionId].status : undefined,
        requirement: doesDataExistForSection
          ? marketingDataSections[manifestSectionId].requirement : undefined,
        isActive: doesDataExistForSection,
        defaultMessage: manifestSection.defaultMessage,
        sections: subSections,
      };

      const errorsForSection = addErrors({ manifestSectionId, manifestSection, validationErrors });
      const accumulatedErrors = subSectionErrors
        ? errorsAcc.concat(subSectionErrors).concat(errorsForSection)
        : errorsAcc.concat(errorsForSection);

      return ({
        errorsAcc: accumulatedErrors,
        sectionsAcc: sectionsAcc.concat(sectionContext),
      });
    }, { errorsAcc: [], sectionsAcc: [] });

  return {
    errors,
    sections,
  };
};

const createSectionGroupsContext = ({
  solutionId, sectionGroups, marketingDataSections, validationErrors, dashboardId,
}) => {
  const {
    errorsAcc: errors,
    sectionGroupsAcc: sectionGroupsContext,
  } = Object.entries(sectionGroups)
    .reduce(({ errorsAcc, sectionGroupsAcc }, [sectionGroupId, sectionGroup]) => {
      const { errors: sectionErrors, sections } = createSectionsContext({
        solutionId,
        manifestSections: sectionGroup.sections,
        marketingDataSections,
        validationErrors,
        dashboardId,
      });

      const sectionGroupContext = {
        id: sectionGroupId,
        title: sectionGroup.title,
        sections,
      };

      return ({
        errorsAcc: errorsAcc.concat(sectionErrors),
        sectionGroupsAcc: sectionGroupsAcc.concat(sectionGroupContext),
      });
    }, { errorsAcc: [], sectionGroupsAcc: [] });

  return {
    errors: errors.length > 0 ? errors : undefined,
    sectionGroups: sectionGroupsContext,
  };
};


export const createDashboardPageContext = ({
  solutionId, dashboardManifest, marketingDataSections, validationErrors, dashboardId,
}) => {
  const { errors, sectionGroups } = createSectionGroupsContext({
    solutionId,
    sectionGroups: dashboardManifest.sectionGroups,
    marketingDataSections,
    validationErrors,
    dashboardId,
  });

  const context = {
    title: dashboardManifest.title,
    mainAdvice: dashboardManifest.mainAdvice,
    additionalAdvice: dashboardManifest.additionalAdvice,
    previewUrl: `/solution/${solutionId}/preview`,
    submitForModerationUrl: `/supplier/solution/${solutionId}/submitForModeration`,
    returnToDashboardUrl: `/supplier/solution/${solutionId}`,
    errors: errors && errors.length > 0 ? errors : undefined,
    sectionGroups,
  };

  return context;
};
