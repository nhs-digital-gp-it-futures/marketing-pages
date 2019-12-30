import { getFormDataValue } from './formData';
import { createErrorForQuestionNew } from './createErrorForQuestion';
import { commonQuestionContext } from './commonQuestionContext';

export const createContextForTextInputsQuestion = ({
  questionId, questionManifest, formData, validationErrors, parentQuestionId,
}) => {
  const errorForQuestion = createErrorForQuestionNew({
    questionId, questionManifest, validationErrors,
  });

  const questionContext = {
    ...commonQuestionContext({ questionId, questionManifest, parentQuestionId }),
    rows: questionManifest.rows,
    data: getFormDataValue({ key: questionId, formData }),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};
