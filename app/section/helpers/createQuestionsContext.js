// eslint-disable-next-line import/no-cycle
import { createQuestionTypeContext } from './createQuestionTypeContext';
import { commonQuestionContext } from './commonQuestionContext';

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
