import { createQuestionsContext } from './helpers/createQuestionsContext';

export const createSectionPageContext = ({
  sectionManifest, formData, validationErrors,
}) => {
  const { errors, questions } = createQuestionsContext({
    sectionManifest, formData, validationErrors,
  });

  const context = {
    title: sectionManifest.title,
    mainAdvice: sectionManifest.mainAdvice,
    additionalAdvice: sectionManifest.additionalAdvice,
    warningAdvice: sectionManifest.warningAdvice || undefined,
    expandableAdvice: sectionManifest.expandableAdvice,
    returnToDashboardUrl: '../',
    submitText: sectionManifest.submitText,
    errors,
    questions,
  };

  return context;
};
