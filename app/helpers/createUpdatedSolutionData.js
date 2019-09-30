import { findExistingMarketingDataForSection } from './findExistingMarketingDataForSection';
import { determineStatusForSection } from './determineStatusForSection';

export const createUpdatedSolutionData = (sectionId, existingSolutionData, sectionData) => {
  const updatedSolutionData = { ...existingSolutionData };

  const sectionToUpdate = findExistingMarketingDataForSection(updatedSolutionData, sectionId);
  if (sectionToUpdate) {
    sectionToUpdate.data = sectionData;
    sectionToUpdate.status = determineStatusForSection(sectionData);

    return updatedSolutionData;
  }

  return existingSolutionData;
};
