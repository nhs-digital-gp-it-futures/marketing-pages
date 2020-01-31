export const createErrorForQuestion = ({
  questionId, questionManifest, validationErrors, parentQuestionId,
}) => {
  if (validationErrors && questionManifest && questionManifest.errorResponse) {
    const errorForQuestion = Object.entries(validationErrors)
      .reduce((errorForQuestionAcc, [erroredQuestion, errorType]) => {
        const linkToQuestion = parentQuestionId ? `#${parentQuestionId}[${questionId}]` : `#${questionId}`;
        if (erroredQuestion === questionId) {
          return {
            text: questionManifest.errorResponse[errorType],
            href: linkToQuestion,
          };
        }
        return errorForQuestionAcc;
      }, undefined);

    return errorForQuestion;
  }
  return undefined;
};
