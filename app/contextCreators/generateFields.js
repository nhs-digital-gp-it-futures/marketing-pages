import { getExistingDataForFieldIfAvailable } from './getExistingDataForFieldIfAvailable';

export const generateFields = (question, exisitingDataForSection, validationErrors) => {
  if (question && question.maxItems && question.maxItems > 0) {
    const fields = [];

    Array(question.maxItems).fill().map((_, i) => {
      const field = {};
      field.id = `${question.id}-${i + 1}`;
      field.data = getExistingDataForFieldIfAvailable(exisitingDataForSection, question.id, i);

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

export const generateFieldsNew = (
  questionId, questionManifest, exisitingDataForSection, validationErrors,
) => {
  if (questionManifest && questionManifest.maxItems && questionManifest.maxItems > 0) {
    const fields = [];

    Array(questionManifest.maxItems).fill().map((_, i) => {
      const field = {};
      field.id = `${questionId}-${i + 1}`;
      field.data = getExistingDataForFieldIfAvailable(exisitingDataForSection, questionId, i);

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
