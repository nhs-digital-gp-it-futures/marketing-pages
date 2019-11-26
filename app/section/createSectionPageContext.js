import { generateFields } from './helpers/generateFields';
import { generateOptions } from './helpers/generateOptions';
import { createErrorForQuestion } from './helpers/createErrorForQuestion';
import { getFormDataValue } from './helpers/formData';

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
  questionId, questionManifest, formData, validationErrors,
) => {
  const errorForQuestion = createErrorForQuestion(
    questionId, questionManifest, validationErrors,
  );

  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest),
    options: generateOptions(questionId, questionManifest.options, formData),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};

const createQuestionTypeContext = {
  'bulletpoint-list': {
    create: (
      questionId, questionManifest, formData, validationErrors,
    ) => createQuestionsContextForBulletpointList(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
  'checkbox-options': {
    create: (
      questionId, questionManifest, formData, validationErrors,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
  'radiobutton-options': {
    create: (
      questionId, questionManifest, formData, validationErrors,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
  'textarea-field': {
    create: (
      questionId, questionManifest, formData, validationErrors,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
  'text-field': {
    create: (
      questionId, questionManifest, formData, validationErrors,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
};

const createQuestionsContext = (
  sectionManifest, formData, validationErrors,
) => {
  const {
    errorsAcc: errors,
    questionsAcc: questionsContext,
  } = Object.entries(sectionManifest.questions)
    .reduce(({ errorsAcc, questionsAcc }, [questionId, questionManifest]) => {
      if (createQuestionTypeContext[questionManifest.type]) {
        const {
          errorForQuestion,
          questionContext,
        } = createQuestionTypeContext[questionManifest.type].create(
          questionId, questionManifest, formData, validationErrors,
        );

        return {
          errorsAcc: errorForQuestion
            && errorForQuestion ? errorsAcc.concat(errorForQuestion) : errorsAcc,
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
  solutionId, sectionManifest, formData, validationErrors,
) => {
  const { errors, questions } = createQuestionsContext(
    sectionManifest, formData, validationErrors,
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
