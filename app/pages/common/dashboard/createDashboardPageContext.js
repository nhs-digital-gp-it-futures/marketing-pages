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
  solutionId,
  manifestSections,
  marketingDataSections,
  validationErrors,
  dashboardId,
  userContextType,
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
          userContextType,
        })
        : { errors: undefined, sections: undefined };

      const sectionPath = dashboardId
        ? `${dashboardId}/${manifestSection.type}/${manifestSectionId}`
        : `${solutionId}/${manifestSection.type}/${manifestSectionId}`;

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
  solutionId, sectionGroups, marketingDataSections, validationErrors, dashboardId, userContextType,
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
        userContextType,
      });

      const sectionGroupContext = {
        id: sectionGroupId,
        title: sectionGroup.title,
        mainAdvice: sectionGroup.mainAdvice,
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
  solutionId,
  solutionName,
  supplierName,
  dashboardManifest,
  marketingDataSections,
  validationErrors,
  dashboardId,
  userContextType = 'supplier',
}) => {
  const { errors, sectionGroups } = createSectionGroupsContext({
    solutionId,
    sectionGroups: dashboardManifest.sectionGroups,
    marketingDataSections,
    validationErrors,
    dashboardId,
    userContextType,
  });

  const isSupplierContextType = userContextType === 'supplier';

  const context = {
    name: solutionName,
    supplierName,
    title: dashboardManifest.title,
    mainAdvice: dashboardManifest.mainAdvice,
    additionalAdvice: dashboardManifest.additionalAdvice,
    previewUrl: `${solutionId}/preview`,
    submitForModerationUrl: isSupplierContextType ? `/supplier/solution/${solutionId}/submitForModeration` : undefined,
    returnToDashboardUrl: '../',
    errors: errors && errors.length > 0 ? errors : undefined,
    sectionGroups,
    warningAdvice: dashboardManifest.warningAdvice,
    sectionsBox: dashboardManifest.sectionsBox,
  };

  return context;
};
