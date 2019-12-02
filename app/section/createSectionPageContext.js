import { createQuestionsContext } from './helpers/createQuestionsContext';

export const createSectionPageContext = (
  solutionId, sectionManifest, formData, validationErrors,
) => {
  const { errors, questions } = createQuestionsContext(
    sectionManifest, formData, validationErrors,
  );

  const context = {
    title: sectionManifest.title,
    submitActionUrl: `/${solutionId}/section/${sectionManifest.id}`,
    mainAdvice: sectionManifest.mainAdvice,
    additionalAdvice: sectionManifest.additionalAdvice,
    warningAdvice: sectionManifest.warningAdvice || undefined,
    returnToDashboardUrl: `/${solutionId}`,
    submitText: sectionManifest.submitText,
    errors,
    questions,
  };

  return context;
};
