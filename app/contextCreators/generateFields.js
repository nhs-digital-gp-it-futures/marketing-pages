import { getExistingDataForFieldIfAvailable } from './getExistingDataForFieldIfAvailable';

const createErrorsForField = (
  fieldId, questionManifest, validationErrors,
) => {
  if (validationErrors) {
    const errorForQuestion = Object.entries(validationErrors)
      .reduce((errorForQuestionAcc, [errorType, erroredQuestions]) => {
        if (erroredQuestions.some(erroredQuestionId => erroredQuestionId === fieldId)) {
          return {
            text: questionManifest.errorResponse[errorType],
            href: `#${fieldId}`,
          };
        }
        return errorForQuestionAcc;
      }, undefined);

    return errorForQuestion;
  }
  return undefined;
};

export const generateFields = (
  questionId, questionManifest, exisitingDataForSection, validationErrors,
) => {
  if (questionManifest && questionManifest.maxItems && questionManifest.maxItems > 0) {
    const { errorsAcc: errors, fieldsAcc: fields } = Array(questionManifest.maxItems).fill().reduce(({ errorsAcc, fieldsAcc }, _, i) => {
      const fieldId = `${questionId}-${i + 1}`;

      const errorForField = createErrorsForField(fieldId, questionManifest, validationErrors);

      const field = {
        id: fieldId,
        data: getExistingDataForFieldIfAvailable(exisitingDataForSection, questionId, i),
        error: errorForField ? { message: errorForField.text } : undefined,
      };

      return {
        errorsAcc: errorForField ? errorsAcc.concat(errorForField) : errorsAcc,
        fieldsAcc: fieldsAcc.concat(field),
      };
    }, { errorsAcc: [], fieldsAcc: [] });

    return {
      errors: errors.length > 0 ? errors : undefined,
      fields,
    };
  }
  return undefined;
};
