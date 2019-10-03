import { generateFields } from './generateFields';

export const createSectionPageContext = (
  solutionId, sectionManifest, formData, validationErrors,
) => {
  const context = {};
  const questions = [];

  context.title = sectionManifest.title;
  context.submitActionUrl = `/${solutionId}/section/${sectionManifest.id}`;
  context.mainAdvice = sectionManifest.mainAdvice;
  context.additionalAdvice = sectionManifest.additionalAdvice;

  sectionManifest.questions.map((sectionManifestQuestion) => {
    const question = {};
    question.id = sectionManifestQuestion.id;
    question.type = sectionManifestQuestion.type;
    question.mainAdvice = sectionManifestQuestion.mainAdvice;
    question.additionalAdvice = sectionManifestQuestion.additionalAdvice;

    if (sectionManifestQuestion.type === 'bulletpoint-list') {
      question.fields = generateFields(sectionManifestQuestion, formData, validationErrors);
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
      }
    }

    questions.push(question);
  });

  context.questions = questions;

  return context;
};
