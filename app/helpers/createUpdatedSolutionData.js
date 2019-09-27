import { findExistingMarketingDataForSection } from './findExistingMarketingDataForSection';

export const createUpdatedSolutionData = (sectionId, existingSolutionData, sectionData) => {
  const updatedSolutionData = { ...existingSolutionData };

  const sectionToUpdate = findExistingMarketingDataForSection(updatedSolutionData, sectionId);
  if (sectionToUpdate) {
    sectionToUpdate.data = sectionData;
    sectionToUpdate.status = 'COMPLETE';

    return updatedSolutionData;
  }

  return existingSolutionData;
};
