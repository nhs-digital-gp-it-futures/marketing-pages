import { generateFieldsNew } from './generateFields';
import { getFormDataValue, doesFormDataContainValue } from '../helpers/formData';

// const createContextForTextInputsValidationErrors = (
//   sectionManifestQuestion, validationErrorForQuestion,
// ) => {
//   if (validationErrorForQuestion
//     && (sectionManifestQuestion.type === 'textarea-field' || sectionManifestQuestion.type === 'text-field')) {
//     const error = {
//       message: validationErrorForQuestion.message,
//     };
//     return error;
//   }
//   return undefined;
// };

// const createErrorSummaryForQuestionContext = (
//   sectionManifestQuestion, validationErrorForQuestion,
// ) => {
//   if (validationErrorForQuestion) {
//     return ({
//       text: validationErrorForQuestion.message,
//       href: `#${sectionManifestQuestion.id}`,
//     });
//   }
//   return undefined;
// };

// const createQuestionContext = (
//   sectionManifestQuestion,
//   optionsManifest,
//   formData,
//   validationErrors,
//   validationErrorForQuestion,
// ) => ({
//   id: sectionManifestQuestion.id,
//   type: sectionManifestQuestion.type,
//   mainAdvice: sectionManifestQuestion.mainAdvice,
//   additionalAdvice: sectionManifestQuestion.additionalAdvice,
//   footerAdvice: sectionManifestQuestion.footerAdvice,
//   rows: sectionManifestQuestion.rows,
//   fields: createContextForBulletpointListQuestion(
//     sectionManifestQuestion, formData, validationErrors,
//   ),
//   options: createContextForOptionsTypeQuestion(
//     sectionManifestQuestion, optionsManifest, formData,
//   ),
//   data: createContextForTextInputsQuestion(sectionManifestQuestion, formData),
//   error: createContextForTextInputsValidationErrors(
//     sectionManifestQuestion, validationErrorForQuestion,
//   ),
// });


// export const createSectionPageContext = (
//   solutionId, sectionManifest, optionsManifest, formData, validationErrors,
// ) => {
//   const errors = [];
//   const questions = [];

//   const context = {
//     title: sectionManifest.title,
//     submitActionUrl: `/${solutionId}/section/${sectionManifest.id}`,
//     mainAdvice: sectionManifest.mainAdvice,
//     additionalAdvice: sectionManifest.additionalAdvice,
//     warningAdvice: sectionManifest.warningAdvice || undefined,
//     returnToDashboardUrl: `/${solutionId}`,
//     submitText: sectionManifest.submitText,
//   };

//   sectionManifest.questions.map((sectionManifestQuestion) => {
//     const validationErrorForQuestion = validationErrors && validationErrors.find(
//       validationError => validationError.questionId === sectionManifestQuestion.id,
//     );

//     const question = createQuestionContext(
//       sectionManifestQuestion,
//       optionsManifest,
//       formData,
//       validationErrors,
//       validationErrorForQuestion,
//     );

//     const errorSummaryContextForQuestion = createErrorSummaryForQuestionContext(
//       sectionManifestQuestion, validationErrorForQuestion,
//     );
//     if (errorSummaryContextForQuestion) {
//       errors.push(errorSummaryContextForQuestion);
//     }

//     questions.push(question);
//   });

//   context.errors = errors;
//   context.questions = questions;

//   return context;
// };

const populateQuestionOptionNew = (
  questionId, questionOption, formData,
) => {
  const populatedOption = questionOption;

  if (doesFormDataContainValue(questionId, questionOption.value, formData)) {
    return {
      ...questionOption,
      checked: true,
    };
  }

  return populatedOption;
};

const createOptionsNew = (questionId, optionsManifest) => {
  const optionsFromManifest = optionsManifest
    && optionsManifest[questionId]
    && optionsManifest[questionId].options;

  return optionsFromManifest
    && Object.entries(optionsFromManifest).map(([optionId, optionValue]) => ({
      text: optionValue,
      value: optionId,
    }));
};

const createContextForOptionsNew = (
  questionId, optionsManifest, formData,
) => {
  const options = createOptionsNew(questionId, optionsManifest);

  const populatedOptions = options.map(option => populateQuestionOptionNew(
    questionId, option, formData,
  ));

  return populatedOptions;
};

const createErrorForQuestion = (
  questionId, questionManifest, validationErrors,
) => {
  if (validationErrors) {
    const errorForQuestion = Object.entries(validationErrors)
      .reduce((errorForQuestionAcc, [errorType, erroredQuestions]) => {
        if (erroredQuestions.some(erroredQuestionId => erroredQuestionId === questionId)) {
          return {
            text: questionManifest.errorResponse[errorType],
            href: `#${questionId}`,
          };
        }
      }, undefined);
    return errorForQuestion;
  }
  return undefined;
};

const commonQuestionContext = (
  questionId, questionManifest,
) => ({
  id: questionId,
  type: questionManifest.type,
  mainAdvice: questionManifest.mainAdvice,
  additionalAdvice: questionManifest.additionalAdvice,
  footerAdvice: questionManifest.footerAdvice,
});

const createQuestionsContextForBulletpointListNew = (
  questionId, questionManifest, formData, validationErrors,
) => {
  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest),
    fields: generateFieldsNew(questionId, questionManifest, formData, validationErrors),
  };

  return questionContext;
};

const createContextForTextInputsQuestionNew = (
  questionId, questionManifest, formData, errorForQuestion,
) => {
  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest),
    rows: questionManifest.rows,
    data: getFormDataValue(questionId, formData),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return questionContext;
};


const createQuestionsContextForOptionsNew = (
  questionId, questionManifest, optionsManifest, formData,
) => {
  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest),
    options: createContextForOptionsNew(questionId, optionsManifest, formData),
  };

  return questionContext;
};

const createQuestionsContextNew = (
  sectionManifest, optionsManifest, formData, validationErrors,
) => {
  const { errorsAcc: errors, questionsAcc: questionsContext } = Object.entries(sectionManifest.questions)
    .reduce(({ errorsAcc, questionsAcc }, [questionId, questionManifest]) => {
      const errorForQuestion = createErrorForQuestion(
        questionId, questionManifest, validationErrors,
      );

      if (questionManifest.type === 'bulletpoint-list') {
        return {
          errorsAcc: errorForQuestion && errorsAcc.concat(errorForQuestion),
          questionsAcc: questionsAcc.concat(createQuestionsContextForBulletpointListNew(
            questionId, questionManifest, formData, validationErrors,
          )),
        };
      }

      if (questionManifest.type === 'checkbox-options' || questionManifest.type === 'radiobutton-options') {
        return {
          errorsAcc: errorForQuestion && errorsAcc.concat(errorForQuestion),
          questionsAcc: questionsAcc.concat(createQuestionsContextForOptionsNew(
            questionId, questionManifest, optionsManifest, formData,
          )),
        };
      }

      if (questionManifest.type === 'textarea-field' || questionManifest.type === 'text-field') {

        return {
          errorsAcc: errorForQuestion && errorsAcc.concat(errorForQuestion),
          questionsAcc: questionsAcc.concat(createContextForTextInputsQuestionNew(
            questionId, questionManifest, formData, errorForQuestion,
          )),
        };
      }

      return {
        errorsAcc: errorForQuestion && errorsAcc.concat(errorForQuestion),
        questionsAcc: questionsAcc.concat(commonQuestionContext(questionId, questionManifest)),
      };
    }, { errorsAcc: [], questionsAcc: [] });

  return {
    errors,
    questions: questionsContext,
  };
};

export const createSectionPageContextNew = (
  solutionId, sectionManifest, optionsManifest, formData, validationErrors,
) => {
  const { errors, questions } = createQuestionsContextNew(
    sectionManifest, optionsManifest, formData, validationErrors,
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
