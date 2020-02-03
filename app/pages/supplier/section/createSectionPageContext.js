import { createQuestionsContext } from '../../common/section/helpers/createQuestionsContext';

export const createSectionPageContext = ({
  solutionId, sectionManifest, formData, validationErrors, dashboardId,
}) => {
  const { errors, questions } = createQuestionsContext({
    sectionManifest, formData, validationErrors,
  });

  const submitActionPath = dashboardId
    ? `/supplier/solution/${solutionId}/dashboard/${dashboardId}/section/${sectionManifest.id}`
    : `/supplier/solution/${solutionId}/section/${sectionManifest.id}`;

  const context = {
    title: sectionManifest.title,
    submitActionUrl: submitActionPath,
    mainAdvice: sectionManifest.mainAdvice,
    additionalAdvice: sectionManifest.additionalAdvice,
    warningAdvice: sectionManifest.warningAdvice || undefined,
    returnToDashboardUrl: `/supplier/solution/${solutionId}`,
    submitText: sectionManifest.submitText,
    errors,
    questions,
  };

  return context;
};
