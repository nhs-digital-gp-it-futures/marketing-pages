import { getMarketingDataForQuestion } from '../helpers/getMarketingDataForQuestion';

const addTitleIfProvided = (questionManifest) => {
  return questionManifest.preview && questionManifest.preview.title ? questionManifest.preview.title : undefined;
};

export const createPreviewPageContext = (
  previewManifest, existingSolutionData,
) => {
  const sections = [];

  previewManifest.map((sectionManifest) => {
    const questions = [];

    sectionManifest.questions.map((questionManifest) => {
      const questionData = getMarketingDataForQuestion(existingSolutionData, sectionManifest.id, questionManifest.id, questionManifest.type);
      const questionRequirment = questionManifest.requirement ? questionManifest.requirement : 'Optional';

      if ((questionRequirment === 'Optional' && questionData)
        || (questionRequirment === 'Mandatory')) {
        const question = {
          id: questionManifest.id,
          title: addTitleIfProvided(questionManifest),
          type: questionManifest.type,
          data: questionData,
        };

        questions.push(question);
      }
    });

    if (questions.length > 0) {
      const section = {
        title: sectionManifest.title,
        questions,
      };

      sections.push(section);
    }
  });

  const context = {
    sections,
  };

  return context;
};
