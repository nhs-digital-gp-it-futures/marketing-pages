import { createQuestionsContext } from './helpers/createQuestionsContext';

export const createSectionPageContext = ({
  solutionId, sectionManifest, formData, validationErrors, dashboardId, userContextType = 'supplier',
}) => {
  const { errors, questions } = createQuestionsContext({
    sectionManifest, formData, validationErrors,
  });

  const submitActionPath = dashboardId
    ? `/${userContextType}/solution/${solutionId}/dashboard/${dashboardId}/section/${sectionManifest.id}`
    : `/${userContextType}/solution/${solutionId}/section/${sectionManifest.id}`;

  const context = {
    title: sectionManifest.title,
    submitActionUrl: submitActionPath,
    mainAdvice: sectionManifest.mainAdvice,
    additionalAdvice: sectionManifest.additionalAdvice,
    warningAdvice: sectionManifest.warningAdvice || undefined,
    returnToDashboardUrl: `/${userContextType}/solution/${solutionId}`,
    submitText: sectionManifest.submitText,
    errors,
    questions,
  };

  return context;
};
