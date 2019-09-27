export const findExistingMarketingDataForTask = (existingSolutionData, taskId) => (
  existingSolutionData
    && existingSolutionData.marketingData
    && existingSolutionData.marketingData.sections
    && existingSolutionData.marketingData.sections
      .find(t => t.id === taskId)
);
