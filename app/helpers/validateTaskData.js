export const validateTaskData = (taskManifest, taskData) => {
  const validationErrors = [];

  taskManifest.questions.map((taskQuestion) => {
    if (taskData[taskQuestion.id] && taskQuestion.saveValidations) {
      taskQuestion.saveValidations.map((saveValidation) => {
        if (saveValidation.type === 'maxLength') {
          taskData[taskQuestion.id].map((taskDataField, taskDataFieldId) => {
            const error = {};
            if (taskDataField.length > saveValidation.maxLength) {
              error.questionId = taskQuestion.id;
              error.fieldId = `${taskQuestion.id}-${taskDataFieldId + 1}`;
              error.message = saveValidation.message;

              validationErrors.push(error);
            }
          });
        }
      });
    }
  });

  return validationErrors;
};
