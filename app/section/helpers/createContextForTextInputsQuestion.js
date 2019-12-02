import { getFormDataValue } from './formData';
import { createErrorForQuestion } from './createErrorForQuestion';
import { commonQuestionContext } from './commonQuestionContext';

export const createContextForTextInputsQuestion = (
  questionId, questionManifest, formData, validationErrors, parentQuestionId,
) => {
  const errorForQuestion = createErrorForQuestion(
    questionId, questionManifest, validationErrors,
  );

  const questionContext = {
    ...commonQuestionContext(questionId, questionManifest, parentQuestionId),
    rows: questionManifest.rows,
    data: getFormDataValue(questionId, formData),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};
