export const findValidationErrorTypeForQuestion = (
  sectionId, questionId, validationErrors,
) => {
  const validationErrorsForSection = validationErrors && validationErrors[sectionId];
  const foundErrorTypes = validationErrorsForSection
     && Object.entries(validationErrorsForSection).map(([errorType, questionsWithErrors]) => {
       if (questionsWithErrors.some(questionIdWithError => questionIdWithError === questionId)) {
         return errorType;
       }
       return undefined;
     });

  const firstErrorTypeFound = foundErrorTypes
      && foundErrorTypes.length > 0 ? foundErrorTypes[0] : undefined;

  return firstErrorTypeFound;
};
