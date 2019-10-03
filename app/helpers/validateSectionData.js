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

export const validateSectionData = (sectionManifest, sectionData) => {
  const validationErrors = [];

  sectionManifest.questions.map((sectionQuestion) => {
    if (sectionData[sectionQuestion.id] && sectionQuestion.saveValidations) {
      sectionQuestion.saveValidations.map((saveValidation) => {
        if (sectionQuestion.type === 'bulletpoint-list') {
          sectionData[sectionQuestion.id].map((sectionDataField, sectionDataFieldId) => {
            if (validationRules[saveValidation.type].rule(sectionDataField, saveValidation)) {
              const error = createErrorForField(
                sectionQuestion.id, sectionDataFieldId, saveValidation.message,
              );
              validationErrors.push(error);
            }
          });
        } else if (validationRules[saveValidation.type]
          .rule(sectionData[sectionQuestion.id], saveValidation)) {
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
