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

const populateQuestionOption = (
  manifestQuestionId, questionOption, formData,
) => {
  const populatedOption = questionOption;

  if (doesFormDataContainValue(manifestQuestionId, questionOption.value, formData)) {
    return {
      ...questionOption,
      checked: true,
    };
  }

  return populatedOption;
};

const createOptions = (questionId, optionsManifest) => {
  const optionsFromManifest = optionsManifest
    && optionsManifest[questionId]
    && optionsManifest[questionId].options;

  return optionsFromManifest
    && Object.entries(optionsFromManifest).map(([optionId, optionValue]) => ({
      text: optionValue,
      value: optionId,
    }));
};

const createContextForOptionsTypeQuestion = (
  sectionManifestQuestion, optionsManifest, formData,
) => {
  if (sectionManifestQuestion.type === 'checkbox-options' || sectionManifestQuestion.type === 'radiobutton-options') {
    const options = createOptions(sectionManifestQuestion.id, optionsManifest);

    const populatedOptions = options.map(option => populateQuestionOption(
      sectionManifestQuestion.id, option, formData,
    ));

    return populatedOptions;
  }

  return undefined;
};

const createContextForTextInputsQuestion = (
  sectionManifestQuestion, formData,
) => {
  if (sectionManifestQuestion.type === 'textarea-field' || sectionManifestQuestion.type === 'text-field') {
    return getFormDataValue(sectionManifestQuestion.id, formData);
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
  sectionManifestQuestion,
  optionsManifest,
  formData,
  validationErrors,
  validationErrorForQuestion,
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
  options: createContextForOptionsTypeQuestion(
    sectionManifestQuestion, optionsManifest, formData,
  ),
  data: createContextForTextInputsQuestion(sectionManifestQuestion, formData),
  error: createContextForTextInputsValidationErrors(
    sectionManifestQuestion, validationErrorForQuestion,
  ),
});

export const createSectionPageContext = (
  solutionId, sectionManifest, optionsManifest, formData, validationErrors,
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
    submitText: sectionManifest.submitText,
  };

  sectionManifest.questions.map((sectionManifestQuestion) => {
    const validationErrorForQuestion = validationErrors && validationErrors.find(
      validationError => validationError.questionId === sectionManifestQuestion.id,
    );

    const question = createQuestionContext(
      sectionManifestQuestion,
      optionsManifest,
      formData,
      validationErrors,
      validationErrorForQuestion,
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
