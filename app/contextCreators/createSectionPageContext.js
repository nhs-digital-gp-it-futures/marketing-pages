import { generateFields } from './generateFields';

export const createSectionPageContext = (solutionId, sectionManifest, formData, validationErrors) => {
  const context = {};
  const questions = [];

  context.title = sectionManifest.title;
  context.submitActionUrl = `/${solutionId}/section/${sectionManifest.id}`;

  sectionManifest.questions.map((sectionManifestQuestion) => {
    const question = {};
    question.id = sectionManifestQuestion.id;
    question.type = sectionManifestQuestion.type;
    question.mainAdvice = sectionManifestQuestion.mainAdvice;
    question.additionalAdvice = sectionManifestQuestion.additionalAdvice;

    if (sectionManifestQuestion.type === 'bulletpoint-list') {
      question.fields = generateFields(sectionManifestQuestion, formData, validationErrors);
    }

    questions.push(question);
  });

  context.questions = questions;

  return context;
};
