import { generateFields } from './generateFields';

const createContextForBulletpointListQuestion = (
  sectionManifestQuestion, formData, validationErrors,
) => {
  if (sectionManifestQuestion.type === 'bulletpoint-list') {
    return generateFields(sectionManifestQuestion, formData, validationErrors);
  }
  return undefined;
};

const createContextForCheckboxOptionsQuestion = (
  sectionManifestQuestion, formData,
) => {
  if (sectionManifestQuestion.type === 'checkbox-options') {
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
    return options;
  }
  return undefined;
};

const createContextForTextInputsQuestion = (
  sectionManifestQuestion, formData,
) => {
  if (sectionManifestQuestion.type === 'textarea-field' || sectionManifestQuestion.type === 'text-field') {
    return formData
      && formData.data
      && formData.data[sectionManifestQuestion.id]
      ? formData.data[sectionManifestQuestion.id] : undefined;
  }
  return undefined;
};

const createContextForTextInputsValidationErrors = (
  sectionManifestQuestion, validationErrorForQuestion,
) => {
  if (validationErrorForQuestion
    && (sectionManifestQuestion.type === 'textarea-field' || sectionManifestQuestion.type === 'text-field')) {
    const error = {
      message: validationErrorForQuestion.message,
    };
    return error;
  }
  return undefined;
};

const createErrorSummaryForQuestionContext = (
  sectionManifestQuestion, validationErrorForQuestion,
) => {
  if (validationErrorForQuestion) {
    return ({
      text: validationErrorForQuestion.message,
      href: `#${sectionManifestQuestion.id}`,
    });
  }
  return undefined;
};

const createQuestionContext = (
  sectionManifestQuestion, formData, validationErrors, validationErrorForQuestion,
) => ({
  id: sectionManifestQuestion.id,
  type: sectionManifestQuestion.type,
  mainAdvice: sectionManifestQuestion.mainAdvice,
  additionalAdvice: sectionManifestQuestion.additionalAdvice,
  footerAdvice: sectionManifestQuestion.footerAdvice,
  rows: sectionManifestQuestion.rows,
  fields: createContextForBulletpointListQuestion(
    sectionManifestQuestion, formData, validationErrors,
  ),
  options: createContextForCheckboxOptionsQuestion(sectionManifestQuestion, formData),
  data: createContextForTextInputsQuestion(sectionManifestQuestion, formData),
  error: createContextForTextInputsValidationErrors(
    sectionManifestQuestion, validationErrorForQuestion,
  ),
});

export const createSectionPageContext = (
  solutionId, sectionManifest, formData, validationErrors,
) => {
  const errors = [];
  const questions = [];

  const context = {
    title: sectionManifest.title,
    submitActionUrl: `/${solutionId}/section/${sectionManifest.id}`,
    mainAdvice: sectionManifest.mainAdvice,
    additionalAdvice: sectionManifest.additionalAdvice,
    warningAdvice: sectionManifest.warningAdvice || undefined,
  };

  sectionManifest.questions.map((sectionManifestQuestion) => {
    const validationErrorForQuestion = validationErrors && validationErrors.find(
      validationError => validationError.questionId === sectionManifestQuestion.id,
    );

    const question = createQuestionContext(
      sectionManifestQuestion, formData, validationErrors, validationErrorForQuestion,
    );

    const errorSummaryContextForQuestion = createErrorSummaryForQuestionContext(
      sectionManifestQuestion, validationErrorForQuestion,
    );
    if (errorSummaryContextForQuestion) {
      errors.push(errorSummaryContextForQuestion);
    }

    questions.push(question);
  });

  context.errors = errors;
  context.questions = questions;

  return context;
};
