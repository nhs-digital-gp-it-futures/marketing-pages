import { getExistingDataForFieldIfAvailable } from './getExistingDataForFieldIfAvailable';

export const generateFields = (question, exisitingDataForTask, validationErrors) => {
  if (question && question.maxItems && question.maxItems > 0) {
    const fields = [];

    Array(question.maxItems).fill().map((_, i) => {
      const field = {};
      field.id = `${question.id}-${i + 1}`;
      field.data = getExistingDataForFieldIfAvailable(exisitingDataForTask, question.id, i);

      const validationErrorForField = validationErrors && validationErrors
        .find(validationError => validationError.fieldId === field.id);

      if (validationErrorForField) {
        const error = {};
        error.message = validationErrorForField.message;
        field.error = error;
      }

      fields.push(field);
    });

    return fields;
  }
  return undefined;
};
