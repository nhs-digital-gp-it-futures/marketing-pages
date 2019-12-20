import { createQuestionsContext } from './helpers/createQuestionsContext';

export const createSectionPageContext = ({
  solutionId, sectionManifest, formData, validationErrors, dashboardId,
}) => {
  const { errors, questions } = createQuestionsContext(
    sectionManifest, formData, validationErrors,
  );

  const submitActionPath = dashboardId
    ? `/solution/${solutionId}/dashboard/${dashboardId}/section/${sectionManifest.id}`
    : `/solution/${solutionId}/section/${sectionManifest.id}`;

  const context = {
    title: sectionManifest.title,
    submitActionUrl: submitActionPath,
    mainAdvice: sectionManifest.mainAdvice,
    additionalAdvice: sectionManifest.additionalAdvice,
    warningAdvice: sectionManifest.warningAdvice || undefined,
    returnToDashboardUrl: `/solution/${solutionId}`,
    submitText: sectionManifest.submitText,
    errors,
    questions,
  };

  return context;
};
