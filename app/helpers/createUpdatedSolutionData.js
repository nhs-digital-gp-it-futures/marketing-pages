import { findExistingMarketingDataForTask } from './findExistingMarketingDataForTask';

export const createUpdatedSolutionData = (taskId, existingSolutionData, taskData) => {
  const updatedSolutionData = { ...existingSolutionData };

  const taskToUpdate = findExistingMarketingDataForTask(updatedSolutionData, taskId);
  if (taskToUpdate) {
    taskToUpdate.data = taskData;
    taskToUpdate.status = 'COMPLETE';

    return updatedSolutionData;
  }

  return existingSolutionData;
};
