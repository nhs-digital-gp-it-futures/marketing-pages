const validationRules = {
  maxLength: {
    rule: (taskDataField, saveValidation) => {
      if (taskDataField.length > saveValidation.maxLength) {
        return true;
      }
      return false;
    },
  },
};

const createErrorForField = (questionId, fieldId, message) => {
  const error = {};
  error.questionId = questionId;
  error.fieldId = `${questionId}-${fieldId + 1}`;
  error.message = message;

  return error;
};

export const validateTaskData = (taskManifest, taskData) => {
  const validationErrors = [];

  taskManifest.questions.map((taskQuestion) => {
    if (taskData[taskQuestion.id] && taskQuestion.saveValidations) {
      taskQuestion.saveValidations.map((saveValidation) => {
        taskData[taskQuestion.id].map((taskDataField, taskDataFieldId) => {
          if (validationRules[saveValidation.type].rule(taskDataField, saveValidation)) {
            const error = createErrorForField(
              taskQuestion.id, taskDataFieldId, saveValidation.message,
            );
            validationErrors.push(error);
          }
        });
      });
    }
  });

  return validationErrors;
};
