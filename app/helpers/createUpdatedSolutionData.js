export const createUpdatedSolutionData = (taskId, existingSolutionData, taskData) => {
  const updatedSolutionData = { ...existingSolutionData };

  updatedSolutionData.marketingData.tasks[0].data = taskData;
  updatedSolutionData.marketingData.tasks[0].status = 'COMPLETE';

  return updatedSolutionData;
};
