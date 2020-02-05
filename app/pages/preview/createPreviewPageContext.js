export const createPreviewPageContext = ({ previewData }) => {
  const sections = Object.fromEntries(
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
  );

  return { sections };
};
