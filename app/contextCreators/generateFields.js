import { getExistingDataForFieldIfAvailable } from './getExistingDataForFieldIfAvailable';
import { createErrorForQuestion as createErrorForField } from './createErrorForQuestion';

export const generateFields = (
  questionId, questionManifest, exisitingDataForSection, validationErrors,
) => {
  if (questionManifest && questionManifest.maxItems && questionManifest.maxItems > 0) {
    const { errorsAcc: errors, fieldsAcc: fields } = Array(questionManifest.maxItems).fill().reduce(({ errorsAcc, fieldsAcc }, _, i) => {
      const fieldId = `${questionId}-${i + 1}`;

      const errorForField = createErrorForField(fieldId, questionManifest, validationErrors);

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
