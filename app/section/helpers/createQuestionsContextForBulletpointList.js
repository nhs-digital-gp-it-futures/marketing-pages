import { generateFields } from './generateFields';
import { commonQuestionContext } from './commonQuestionContext';

export const createQuestionsContextForBulletpointList = ({
  questionId, questionManifest, formData, validationErrors,
}) => {
  const { errors: errorForQuestion, fields } = generateFields({
    questionId, questionManifest, exisitingDataForSection: formData, validationErrors,
  });

  const questionContext = {
    ...commonQuestionContext({ questionId, questionManifest }),
    fields,
  };

  return {
    errorForQuestion,
    questionContext,
  };
};
