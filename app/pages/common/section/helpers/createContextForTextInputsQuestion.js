import { getFormDataValue } from './formData';
import { createErrorForQuestion } from './createErrorForQuestion';
import { commonQuestionContext } from './commonQuestionContext';

export const createContextForTextInputsQuestion = ({
  questionId, questionManifest, formData, validationErrors, parentQuestionId,
}) => {
  const errorForQuestion = createErrorForQuestion({
    questionId, questionManifest, validationErrors, parentQuestionId,
  });

  const questionContext = {
    ...commonQuestionContext({ questionId, questionManifest, parentQuestionId }),
    rows: questionManifest.rows,
    maxlength: questionManifest.maxlength,
    data: getFormDataValue({ key: questionId, formData }),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};
