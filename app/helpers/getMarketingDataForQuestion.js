export const getMarketingDataForQuestion = (marketingDataForSection, questionId, questionType) => {
  if (marketingDataForSection
    && marketingDataForSection.data
    && marketingDataForSection.data[questionId]
    && questionType === 'bulletpoint-list') {
    const dataWithValues = marketingDataForSection.data[questionId].filter(data => data.length > 0);
    return dataWithValues.length > 0 ? dataWithValues : undefined;
  }

  return marketingDataForSection && marketingDataForSection.data
    ? marketingDataForSection.data[questionId] : undefined;
};
