export const validateTaskData = (taskManifest, taskData) => {
  const validationErrors = [];

  taskManifest.questions.map((taskQuestion) => {
    if (taskData[taskQuestion.id]) {
      taskQuestion.saveValidations.map((saveValidation) => {
        if (saveValidation.type === 'maxLength') {
          taskData[taskQuestion.id].map((taskDataField, taskDataFieldId) => {
            const error = {};
            if (taskDataField.length > saveValidation.maxLength) {
              error.questionId = taskQuestion.id;
              error.fieldId = taskDataFieldId;

              validationErrors.push(error);
            }
          });
        }
      });
    }
  });

  return validationErrors;
};
