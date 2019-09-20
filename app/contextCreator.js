const getExistingDataIfAvailable = (exisitingDataForTask, questionId, index) => (
  exisitingDataForTask
  && exisitingDataForTask.data
  && exisitingDataForTask.data[questionId]
  && exisitingDataForTask.data[questionId][index]
    ? exisitingDataForTask.data[questionId][index] : undefined
);


const generateFields = (question, exisitingDataForTask) => {
  const fields = [];

  Array(question.maxItems).fill().map((_, i) => {
    const field = {};
    field.id = `${question.id}-${i + 1}`;
    field.data = getExistingDataIfAvailable(exisitingDataForTask, question.id, i);
    fields.push(field);
  });

  return fields;
};

const findExistingMarketingDataForTask = (existingSolutionData, taskId) => (
  existingSolutionData
  && existingSolutionData.marketingData
  && existingSolutionData.marketingData.tasks
    .find(t => t.id === taskId)
);

export const createTaskPageContext = (solutionId, taskManifest, existingSolutionData) => {
  const context = {};
  const questions = [];

  context.title = taskManifest.title;
  context.submitActionUrl = `/${solutionId}/task/${taskManifest.id}`;

  taskManifest.questions.map((taskManifestQuestion) => {
    const question = {};
    question.id = taskManifestQuestion.id;
    question.type = taskManifestQuestion.type;
    question.mainAdvice = taskManifestQuestion.mainAdvice;
    question.additionalAdvice = taskManifestQuestion.additionalAdvice;

    if (taskManifestQuestion.type === 'bulletpoint-list') {
      const exisitingDataForTask = findExistingMarketingDataForTask(
        existingSolutionData, taskManifest.id,
      );
      question.fields = generateFields(taskManifestQuestion, exisitingDataForTask);
    }

    questions.push(question);
  });

  context.questions = questions;

  return context;
};
