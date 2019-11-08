export const createErrorForQuestion = (
  questionId, questionManifest, validationErrors,
) => {
  if (validationErrors && questionManifest && questionManifest.errorResponse) {
    const errorForQuestion = Object.entries(validationErrors)
      .reduce((errorForQuestionAcc, [errorType, erroredQuestions]) => {
        if (erroredQuestions.some(erroredQuestionId => erroredQuestionId === questionId)) {
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
