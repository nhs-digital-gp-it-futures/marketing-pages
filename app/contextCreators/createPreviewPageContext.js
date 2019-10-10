import { findExistingMarketingDataForSection } from '../helpers/findExistingMarketingDataForSection';

const getMarketingDataForQuestion = (existingSolutionData, sectionId, questionId) => {
  const marketingDataForSection = findExistingMarketingDataForSection(
    existingSolutionData, sectionId,
  );
  return marketingDataForSection ? marketingDataForSection.data[questionId] : undefined;
};

export const createPreviewPageContext = (
  previewManifest, existingSolutionData,
) => {
  const sections = [];

  previewManifest.map((sectionManifest) => {
    const questions = [];

    sectionManifest.questions.map((questionManifest) => {
      const question = {
        id: questionManifest.id,
        title: questionManifest.preview.title,
        type: questionManifest.type,
        data: getMarketingDataForQuestion(existingSolutionData, sectionManifest.id, questionManifest.id),
      };

      questions.push(question);
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
