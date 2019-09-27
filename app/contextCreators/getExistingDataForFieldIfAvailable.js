export const getExistingDataForFieldIfAvailable = (exisitingDataForSection, questionId, index) => (
  exisitingDataForSection
    && exisitingDataForSection.data
    && exisitingDataForSection.data[questionId]
    && exisitingDataForSection.data[questionId][index]
    ? exisitingDataForSection.data[questionId][index] : undefined
);
