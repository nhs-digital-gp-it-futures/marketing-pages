import { generateFields } from './generateFields';
import { generateOptions } from './generateOptions';
import { createErrorForQuestion } from './createErrorForQuestion';
import { getFormDataValue } from '../helpers/formData';

const commonQuestionContext = (
  questionId, questionManifest,
) => ({
  id: questionId,
  type: questionManifest.type,
  mainAdvice: questionManifest.mainAdvice,
  additionalAdvice: questionManifest.additionalAdvice,
  footerAdvice: questionManifest.footerAdvice,
});

const createQuestionsContextForBulletpointList = (
  questionId, questionManifest, formData, validationErrors,
) => {
  const { errors: errorForQuestion, fields } = generateFields(
    questionId, questionManifest, formData, validationErrors,
  );

  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest),
    fields,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};

const createContextForTextInputsQuestion = (
  questionId, questionManifest, formData, validationErrors,
) => {
  const errorForQuestion = createErrorForQuestion(
    questionId, questionManifest, validationErrors,
  );

  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest),
    rows: questionManifest.rows,
    data: getFormDataValue(questionId, formData),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};


const createQuestionsContextForOptions = (
  questionId, questionManifest, optionsManifest, formData, validationErrors,
) => {
  const errorForQuestion = createErrorForQuestion(
    questionId, questionManifest, validationErrors,
  );

  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest),
    options: generateOptions(questionId, optionsManifest, formData),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};

const createQuestionsContext = (
  sectionManifest, optionsManifest, formData, validationErrors,
) => {
  const { errorsAcc: errors, questionsAcc: questionsContext } = Object.entries(sectionManifest.questions)
    .reduce(({ errorsAcc, questionsAcc }, [questionId, questionManifest]) => {
      if (questionManifest.type === 'bulletpoint-list') {
        const { errorForQuestion, questionContext } = createQuestionsContextForBulletpointList(
          questionId, questionManifest, formData, validationErrors,
        );

        return {
          errorsAcc: errorForQuestion && errorsAcc.concat(errorForQuestion),
          questionsAcc: questionsAcc.concat(questionContext),
        };
      }

      if (questionManifest.type === 'checkbox-options' || questionManifest.type === 'radiobutton-options') {
        const { errorForQuestion, questionContext } = createQuestionsContextForOptions(
          questionId, questionManifest, optionsManifest, formData, validationErrors,
        );

        return {
          errorsAcc: errorForQuestion ? errorsAcc.concat(errorForQuestion) : errorsAcc,
          questionsAcc: questionsAcc.concat(questionContext),
        };
      }

      if (questionManifest.type === 'textarea-field' || questionManifest.type === 'text-field') {
        const { errorForQuestion, questionContext } = createContextForTextInputsQuestion(
          questionId, questionManifest, formData, validationErrors,
        );

        return {
          errorsAcc: errorForQuestion ? errorsAcc.concat(errorForQuestion) : errorsAcc,
          questionsAcc: questionsAcc.concat(questionContext),
        };
      }

      return {
        errorsAcc,
        questionsAcc: questionsAcc.concat(commonQuestionContext(questionId, questionManifest)),
      };
    }, { errorsAcc: [], questionsAcc: [] });

  return {
    errors: errors && errors.length > 0 ? errors : undefined,
    questions: questionsContext,
  };
};

export const createSectionPageContext = (
  solutionId, sectionManifest, optionsManifest, formData, validationErrors,
) => {
  const { errors, questions } = createQuestionsContext(
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
