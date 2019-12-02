// eslint-disable-next-line import/no-cycle
import { createContextForMultiQuestion } from './createContextForMultiQuestion';
import { createQuestionsContextForBulletpointList } from './createQuestionsContextForBulletpointList';
import { createQuestionsContextForOptions } from './createQuestionsContextForOptions';
import { createContextForTextInputsQuestion } from './createContextForTextInputsQuestion';
import { commonQuestionContext } from './commonQuestionContext';

const createQuestionTypeContext = {
  'bulletpoint-list': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createQuestionsContextForBulletpointList(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'checkbox-options': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'radiobutton-options': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'textarea-field': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'text-field': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'multi-question': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createContextForMultiQuestion(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
};

export const createQuestionsContext = (
  sectionManifest, formData, validationErrors, parentQuestionId,
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
          questionId, questionManifest, formData, validationErrors, parentQuestionId,
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
