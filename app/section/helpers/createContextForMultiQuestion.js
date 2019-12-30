// eslint-disable-next-line import/no-cycle
import { createQuestionsContext } from './createQuestionsContext';
import { commonQuestionContext } from './commonQuestionContext';

export const createContextForMultiQuestion = ({
  questionId, questionManifest, formData, validationErrors,
}) => {
  const innerQuestionFormData = formData && formData[questionId];

  const { errorForQuestion, questions } = createQuestionsContext({
    sectionManifest: questionManifest,
    formData: innerQuestionFormData,
    validationErrors,
    parentQuestionId: questionId,
  });

  const questionContext = {
    ...commonQuestionContext({ questionId, questionManifest }),
    questions,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};
