export const getExistingDataForFieldIfAvailable = (exisitingDataForSection, questionId, index) => (
  exisitingDataForSection
    && exisitingDataForSection[questionId]
    && exisitingDataForSection[questionId][index]
    ? exisitingDataForSection[questionId][index] : undefined
);
