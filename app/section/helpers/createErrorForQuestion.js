export const createErrorForQuestionNew = ({
  questionId, questionManifest, validationErrors,
}) => {
  if (validationErrors && questionManifest && questionManifest.errorResponse) {
    const errorForQuestion = Object.entries(validationErrors)
      .reduce((errorForQuestionAcc, [erroredQuestion, errorType]) => {
        if (erroredQuestion === questionId) {
          return {
            text: questionManifest.errorResponse[errorType],
            href: `#${questionId}`,
          };
        }
        return errorForQuestionAcc;
      }, undefined);

    return errorForQuestion;
  }
  return undefined;
};
