const validationRules = {
  maxLength: {
    rule: (sectionDataField, saveValidation) => {
      if (sectionDataField.length > saveValidation.maxLength) {
        return true;
      }
      return false;
    },
  },
};

const createErrorForField = (questionId, fieldId, message) => {
  const error = {};
  error.questionId = questionId;
  error.fieldId = fieldId !== undefined ? `${questionId}-${fieldId + 1}` : undefined;
  error.message = message;

  return error;
};

const executeValidationRule = (saveValidation, sectionDataField) => {
  return validationRules[saveValidation.type]
    && validationRules[saveValidation.type]
      .rule(sectionDataField, saveValidation);
};

export const validateSectionData = (sectionManifest, sectionData) => {
  const validationErrors = [];

  sectionManifest.questions.map((sectionQuestion) => {
    if (sectionData[sectionQuestion.id] && sectionQuestion.saveValidations) {
      sectionQuestion.saveValidations.map((saveValidation) => {
        if (sectionQuestion.type === 'bulletpoint-list') {
          sectionData[sectionQuestion.id].map((sectionDataField, sectionDataFieldId) => {
            if (executeValidationRule(saveValidation, sectionDataField)) {
              const error = createErrorForField(
                sectionQuestion.id, sectionDataFieldId, saveValidation.message,
              );
              validationErrors.push(error);
            }
          });
        } else if (executeValidationRule(saveValidation, sectionData[sectionQuestion.id])) {
          const error = createErrorForField(
            sectionQuestion.id, undefined, saveValidation.message,
          );
          validationErrors.push(error);
        }
      });
    }
  });

  return validationErrors;
};
