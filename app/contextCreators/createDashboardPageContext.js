const addErrors = (manifestSectionId, manifestSection, validationErrors) => {
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

const createSectionsContext = (
  solutionId, manifestSections, marketingDataSections, validationErrors,
) => {
  const { errorsAcc: errors, sectionsAcc: sections } = Object.entries(manifestSections)
    .reduce(({ errorsAcc, sectionsAcc }, [manifestSectionId, manifestSection]) => {
      const doesDataExistForSection = !!(marketingDataSections
        && marketingDataSections[manifestSectionId]);

      const { errors: subSectionErrors, sections: subSections } = manifestSection.sections
        ? createSectionsContext(
          solutionId,
          manifestSection.sections,
          marketingDataSections[manifestSectionId].sections,
          validationErrors,
          errorsAcc,
        )
        : { errors: undefined, sections: undefined };

      const sectionContext = {
        URL: `/${solutionId}/${manifestSection.type}/${manifestSectionId}`,
        id: manifestSectionId,
        title: manifestSection.title,
        status: doesDataExistForSection ? marketingDataSections[manifestSectionId].status : undefined,
        requirement: doesDataExistForSection
          ? marketingDataSections[manifestSectionId].requirement : undefined,
        isActive: doesDataExistForSection,
        defaultMessage: manifestSection.defaultMessage,
        sections: subSections,
      };

      const errorsForSection = addErrors(manifestSectionId, manifestSection, validationErrors);
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

const createSectionGroupsContext = (
  solutionId, sectionGroups, marketingDataSections, validationErrors,
) => {
  const { errorsAcc: errors, sectionGroupsAcc: sectionGroupsContext } = Object.entries(sectionGroups)
    .reduce(({ errorsAcc, sectionGroupsAcc }, [sectionGroupId, sectionGroup]) => {
      const { errors: sectionErrors, sections } = createSectionsContext(
        solutionId, sectionGroup.sections, marketingDataSections, validationErrors,
      );

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


export const createDashboardPageContext = (
  solutionId, dashboardManifest, marketingDataSections, validationErrors,
) => {
  const { errors, sectionGroups } = createSectionGroupsContext(
    solutionId, dashboardManifest.sectionGroups, marketingDataSections, validationErrors,
  );

  const context = {
    title: dashboardManifest.title,
    mainAdvice: dashboardManifest.mainAdvice,
    additionalAdvice: dashboardManifest.additionalAdvice,
    previewUrl: `/${solutionId}/preview`,
    submitForModerationUrl: `/${solutionId}/submitForModeration`,
    returnToDashboardUrl: `/${solutionId}`,
    errors: errors && errors.length > 0 ? errors : undefined,
    sectionGroups,
  };

  return context;
};
