import { generateFields } from './generateFields';

export const createSectionPageContext = (
  solutionId, sectionManifest, formData, validationErrors,
) => {
  const context = {};
  const errors = [];
  const questions = [];

  context.title = sectionManifest.title;
  context.submitActionUrl = `/${solutionId}/section/${sectionManifest.id}`;
  context.mainAdvice = sectionManifest.mainAdvice;
  context.additionalAdvice = sectionManifest.additionalAdvice;
  context.warningAdvice = sectionManifest.warningAdvice || undefined;

  sectionManifest.questions.map((sectionManifestQuestion) => {
    const question = {};
    question.id = sectionManifestQuestion.id;
    question.type = sectionManifestQuestion.type;
    question.mainAdvice = sectionManifestQuestion.mainAdvice;
    question.additionalAdvice = sectionManifestQuestion.additionalAdvice;
    question.footerAdvice = sectionManifestQuestion.footerAdvice;

    if (sectionManifestQuestion.type === 'bulletpoint-list') {
      question.fields = generateFields(sectionManifestQuestion, formData, validationErrors);
    } else if (sectionManifestQuestion.type === 'checkbox-options') {
      const options = [];
      sectionManifestQuestion.options.map((manifestOption) => {
        if (formData && formData.data
          && formData.data[sectionManifestQuestion.id]
          && formData.data[sectionManifestQuestion.id]
            .some(questionData => questionData === manifestOption.value)) {
          const checkedOption = {
            ...manifestOption,
            checked: true,
          };
          options.push(checkedOption);
        } else {
          options.push(manifestOption);
        }
      });
      question.options = options;
    } else {
      question.data = formData
        && formData.data
        && formData.data[sectionManifestQuestion.id]
        ? formData.data[sectionManifestQuestion.id] : undefined;

      const findValidationErrorForQuestion = validationErrors && validationErrors.find(
        validationError => validationError.questionId === sectionManifestQuestion.id,
      );

      if (findValidationErrorForQuestion) {
        const error = {};
        error.message = findValidationErrorForQuestion.message;
        question.error = error;

        const contextError = {};
        contextError.text = findValidationErrorForQuestion.message;
        contextError.href = `#${sectionManifestQuestion.id}`;
        errors.push(contextError);
      }

      question.rows = sectionManifestQuestion.rows;
    }

    questions.push(question);
  });

  context.errors = errors;
  context.questions = questions;

  return context;
};
