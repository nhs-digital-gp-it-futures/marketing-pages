export const createPreviewPageContext = ({ previewData }) => ({
  title: previewData.name,
  solutionHeader: {
    id: previewData.id,
    name: previewData.name,
    supplierName: previewData.supplierName,
    isFoundation: previewData.isFoundation,
    lastUpdated: previewData.lastUpdated,
  },
  returnToDashboardUrl: `../${previewData.id}`,
  sections: Object.fromEntries(
    Object.entries(previewData.sections).map(([key, sectionValue]) => {
      if (sectionValue.answers && sectionValue.answers['document-name']) {
        const answerSection = {
          answers: {
            ...sectionValue.answers,
            'document-link': `document/${sectionValue.answers['document-name']}`,
          },
        };
        delete answerSection.answers['document-name'];
        return [key, {
          ...sectionValue,
          ...answerSection,
        }];
      }
      return [key, sectionValue];
    }),
  ),
});
