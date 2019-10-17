import { findExistingMarketingDataForSection } from '../helpers/findExistingMarketingDataForSection';
import { getMarketingDataForQuestion } from '../helpers/getMarketingDataForQuestion';
import { findValidationErrorTypeForQuestion } from '../helpers/findValidationErrorTypeForQuestion';

const addTitleIfProvided = questionManifest => (
  questionManifest.preview
    && questionManifest.preview.title ? questionManifest.preview.title : undefined
);

const shouldQuestionBeAddedToPreviewContext = (questionManifest, questionData, sectionData) => {
  const isQuestionMandatory = sectionData
    && sectionData.mandatory
    && sectionData.mandatory.some(
      mandatoryQuestionId => mandatoryQuestionId === questionManifest.id,
    );
  const questionRequirment = isQuestionMandatory ? 'Mandatory' : 'Optional';
  return (questionRequirment === 'Optional' && questionData) || (questionRequirment === 'Mandatory');
};

const overrideQuestionTypeIfApplicable = questionManifest => (
  questionManifest.preview
    && questionManifest.preview.type ? questionManifest.preview.type : questionManifest.type
);

const getErrorMessageForQuestion = (errorType, questionManifest) => {
  const submitValidationForErrorType = questionManifest.submitValidations
    && questionManifest.submitValidations
      .find(submitValidation => submitValidation.type === errorType);

  return submitValidationForErrorType ? submitValidationForErrorType.message : undefined;
};

const createQuestionContext = (questionManifest, questionData, errorForQuestion) => ({
  id: questionManifest.id,
  title: addTitleIfProvided(questionManifest),
  type: overrideQuestionTypeIfApplicable(questionManifest),
  data: questionData,
  error: errorForQuestion || undefined,
});

const shouldSectionBeAddedToPreviewContext = questions => questions.length > 0;

const createSectionContext = (sectionManifest, questions) => ({
  id: sectionManifest.id,
  title: sectionManifest.title,
  questions,
});

const createErrorSummaryContextForQuestion = (questionId, errorMessage) => {
  const contextError = {};
  contextError.text = errorMessage;
  contextError.href = `#${questionId}`;
  return contextError;
};

export const createPreviewPageContext = (
  solutionId, previewManifest, existingSolutionData, previewValidationErrors,
) => {
  const sections = [];
  const errors = [];

  previewManifest.map((sectionManifest) => {
    const questions = [];

    sectionManifest.questions.map((questionManifest) => {
      const sectionData = findExistingMarketingDataForSection(
        existingSolutionData, sectionManifest.id,
      );
      const questionData = getMarketingDataForQuestion(
        sectionData, questionManifest.id, questionManifest.type,
      );

      if (shouldQuestionBeAddedToPreviewContext(questionManifest, questionData, sectionData)) {
        let errorForQuestion;

        const errorTypeIfApplicable = findValidationErrorTypeForQuestion(
          sectionManifest.id, questionManifest.id, previewValidationErrors,
        );

        if (errorTypeIfApplicable) {
          const errorMessage = getErrorMessageForQuestion(errorTypeIfApplicable, questionManifest);
          errorForQuestion = { message: errorMessage };

          const errorSummaryContextForQuestion = createErrorSummaryContextForQuestion(
            questionManifest.id, errorMessage,
          );
          errors.push(errorSummaryContextForQuestion);
        }

        const question = createQuestionContext(
          questionManifest, questionData, errorForQuestion,
        );

        questions.push(question);
      }
    });

    if (shouldSectionBeAddedToPreviewContext(questions)) {
      const section = createSectionContext(sectionManifest, questions);
      sections.push(section);
    }
  });

  const context = {
    submitPreviewUrl: `/${solutionId}/submitPreview`,
    errors: errors.length > 0 ? errors : undefined,
    sections,
  };

  return context;
};
