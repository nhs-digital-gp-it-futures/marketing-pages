export const createMarketingDashboardContext = (solutionId, dashboardManifest, marketingData) => {
  const context = {};
  const sections = [];

  dashboardManifest.sections.map((manifestSection) => {
    const section = {};
    const tasks = [];

    section.id = manifestSection.id;
    section.title = manifestSection.title;

    manifestSection.tasks.map((manifestTask) => {
      const task = {};
      task.URL = `/${solutionId}/task/${manifestTask.id}`;
      task.title = manifestTask.title;
      task.requirement = manifestTask.requirement;

      const { status } = marketingData.tasks
        .find(marketingDataTask => marketingDataTask.id === manifestTask.id);
      task.status = status;

      tasks.push(task);
    });

    section.tasks = tasks;
    sections.push(section);
  });

  context.sections = sections;

  return context;
};

const generateFields = (question) => {
  const fields = [];

  Array(question.maxItems).fill().map((_, i) => {
    const field = {};
    field.id = `${question.id}-${i + 1}`;
    field.data = '';
    fields.push(field);
  });

  return fields;
};

export const createTaskPageContext = (taskManifest) => {
  const context = {};
  const questions = [];

  context.title = taskManifest.title;

  taskManifest.questions.map((taskManifestQuestion) => {
    const question = {};
    question.id = taskManifestQuestion.id;
    question.type = taskManifestQuestion.type;
    question.mainAdvice = taskManifestQuestion.mainAdvice;
    question.additionalAdvice = taskManifestQuestion.additionalAdvice;

    if (taskManifestQuestion.type === 'bulletpoint-list') {
      question.fields = generateFields(taskManifestQuestion);
    }

    questions.push(question);
  });

  context.questions = questions;

  return context;
};
