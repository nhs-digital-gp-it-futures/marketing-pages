export const findExistingMarketingDataForSection = (existingSolutionData, sectionId) => (
  existingSolutionData
    && existingSolutionData.marketingData
    && existingSolutionData.marketingData.sections
    && existingSolutionData.marketingData.sections
      .find(t => t.id === sectionId)
);
