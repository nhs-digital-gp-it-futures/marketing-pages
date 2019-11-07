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

const createQuestionTypeContext = {
  'bulletpoint-list': {
    create: (
      questionId, questionManifest, optionsManifest, formData, validationErrors,
    ) => createQuestionsContextForBulletpointList(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
  'checkbox-options': {
    create: (
      questionId, questionManifest, optionsManifest, formData, validationErrors,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, optionsManifest, formData, validationErrors,
    ),
  },
  'radiobutton-options': {
    create: (
      questionId, questionManifest, optionsManifest, formData, validationErrors,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, optionsManifest, formData, validationErrors,
    ),
  },
  'textarea-field': {
    create: (
      questionId, questionManifest, optionsManifest, formData, validationErrors,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
  'text-field': {
    create: (
      questionId, questionManifest, optionsManifest, formData, validationErrors,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors,
    ),
  },
};

const createQuestionsContext = (
  sectionManifest, optionsManifest, formData, validationErrors,
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
          questionId, questionManifest, optionsManifest, formData, validationErrors,
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
