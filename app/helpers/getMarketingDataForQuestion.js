import { findExistingMarketingDataForSection } from './findExistingMarketingDataForSection';

export const getMarketingDataForQuestion = (
  existingSolutionData, sectionId, questionId, questionType,
) => {
  const marketingDataForSection = findExistingMarketingDataForSection(
    existingSolutionData, sectionId,
  );

  if (marketingDataForSection && marketingDataForSection.data[questionId] && questionType === 'bulletpoint-list') {
    const dataWithValues = marketingDataForSection.data[questionId].filter(data => data.length > 0);
    return dataWithValues.length > 0 ? dataWithValues : undefined;
  }

  return marketingDataForSection ? marketingDataForSection.data[questionId] : undefined;
};
