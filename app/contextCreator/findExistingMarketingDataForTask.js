export const findExistingMarketingDataForTask = (existingSolutionData, taskId) => (
  existingSolutionData
    && existingSolutionData.marketingData
    && existingSolutionData.marketingData.tasks
    && existingSolutionData.marketingData.tasks
      .find(t => t.id === taskId)
);
