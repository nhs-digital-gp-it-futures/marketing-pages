import { generateOptions } from './generateOptions';
import { createErrorForQuestion } from './createErrorForQuestion';
import { commonQuestionContext } from './commonQuestionContext';

export const createQuestionsContextForOptions = ({
  questionId, questionManifest, formData, validationErrors,
}) => {
  const errorForQuestion = createErrorForQuestion(
    questionId, questionManifest, validationErrors,
  );

  const questionContext = {
    ...commonQuestionContext({ questionId, questionManifest }),
    options: generateOptions(questionId, questionManifest.options, formData, questionManifest.type),
    error: errorForQuestion ? { message: errorForQuestion.text } : undefined,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};
