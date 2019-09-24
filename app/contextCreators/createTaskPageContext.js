import { generateFields } from './generateFields';

export const createTaskPageContext = (solutionId, taskManifest, formData, validationErrors) => {
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
      question.fields = generateFields(taskManifestQuestion, formData, validationErrors);
    }

    questions.push(question);
  });

  context.questions = questions;

  return context;
};
