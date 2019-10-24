import { generateFields } from './generateFields';
import { getFormDataValue, doesFormDataContainValue } from '../helpers/formData';

const createContextForBulletpointListQuestion = (
  sectionManifestQuestion, formData, validationErrors,
) => {
  if (sectionManifestQuestion.type === 'bulletpoint-list') {
    return generateFields(sectionManifestQuestion, formData, validationErrors);
  }
  return undefined;
};

const createQuestionOption = (
  manifestQuestionId, manifestOption, formData,
) => {
  const option = manifestOption;

  if (doesFormDataContainValue(manifestQuestionId, option.value, formData)) {
    return {
      ...option,
      checked: true,
    };
  }

  return option;
};

const createContextForOptionsTypeQuestion = (
  sectionManifestQuestion, formData,
) => {
  if (sectionManifestQuestion.type === 'checkbox-options' || sectionManifestQuestion.type === 'radiobutton-options') {
    const options = [];

    sectionManifestQuestion.options.map((manifestOption) => {
      const option = createQuestionOption(sectionManifestQuestion.id, manifestOption, formData);
      options.push(option);
    });
    return options;
  }

  return undefined;
};

const createContextForTextInputsQuestion = (
  sectionManifestQuestion, formData,
) => {
  if (sectionManifestQuestion.type === 'textarea-field' || sectionManifestQuestion.type === 'text-field') {
    return getFormDataValue(formData, sectionManifestQuestion.id);
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
  options: createContextForOptionsTypeQuestion(sectionManifestQuestion, formData),
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
    returnToDashboardUrl: `/${solutionId}`,
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
