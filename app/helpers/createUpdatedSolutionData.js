import { findExistingMarketingDataForSection } from './findExistingMarketingDataForSection';
import { determineStatusForSection } from './determineStatusForSection';

export const createUpdatedSolutionData = (sectionId, existingSolutionData, sectionManifest, sectionData) => {
  const updatedSolutionData = { ...existingSolutionData };

  const sectionToUpdate = findExistingMarketingDataForSection(updatedSolutionData, sectionId);
  if (sectionToUpdate) {
    sectionToUpdate.data = sectionData;
    sectionToUpdate.status = determineStatusForSection(sectionManifest, sectionData);

    return updatedSolutionData;
  }

  return existingSolutionData;
};
