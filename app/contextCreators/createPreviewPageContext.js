import { findExistingMarketingDataForSection } from '../helpers/findExistingMarketingDataForSection';

const getMarketingDataForQuestion = (existingSolutionData, sectionId, questionId) => {
  const marketingDataForSection = findExistingMarketingDataForSection(
    existingSolutionData, sectionId,
  );
  return marketingDataForSection ? marketingDataForSection.data[questionId] : undefined;
};

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
      const questionData = getMarketingDataForQuestion(existingSolutionData, sectionManifest.id, questionManifest.id);
      const questionRequirment = questionManifest.requirement ? questionManifest.requirement : 'Optional';

      if (questionRequirment === 'Optional' && questionData) {
        const question = {
          id: questionManifest.id,
          title: addTitleIfProvided(questionManifest),
          type: questionManifest.type,
          data: questionData,
        };

        questions.push(question);
      }
    });

    const section = {
      title: sectionManifest.title,
      questions,
    };

    sections.push(section);
  });

  const context = {
    sections,
  };

  return context;
};
