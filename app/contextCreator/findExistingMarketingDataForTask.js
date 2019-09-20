export const findExistingMarketingDataForTask = (existingSolutionData, taskId) => (
  existingSolutionData
    && existingSolutionData.marketingData
    && existingSolutionData.marketingData.tasks
      .find(t => t.id === taskId)
);
