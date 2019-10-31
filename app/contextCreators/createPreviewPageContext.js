import { ManifestProvider } from '../forms/manifestProvider';

const getOptionsManifestForSection = sectionId => (
  new ManifestProvider().getOptionsManifest(sectionId)
);

const updateSections = (sections) => {
  const updatedSections = sections
    && Object.entries(sections).reduce((section, [sectionKey, sectionValue]) => {
      if (sectionValue.answers) {
        const optionManifest = getOptionsManifestForSection(sectionKey);
        const updatedAnswers = Object.entries(sectionValue.answers)
          .reduce((answers, [answerId, answerValues]) => {
            if (optionManifest && optionManifest[answerId]) {
              const newAnswerValues = Array.isArray(answerValues)
                ? answerValues.map(answerValue => optionManifest[answerId].options[answerValue])
                : optionManifest[answerId].options[answerValues];

              return ({
                ...answers,
                [answerId]: newAnswerValues,
              });
            }
            return ({
              ...answers,
              [answerId]: answerValues,
            });
          }, {});

        return ({
          ...section,
          [sectionKey]: {
            answers: updatedAnswers,
          },
        });
      }

      const sectionFromRecursive = updateSections(sectionValue.sections);
      return ({
        ...section,
        [sectionKey]: {
          ...sectionValue,
          sections: sectionFromRecursive,
        },
      });
    }, {});

  return updatedSections;
};

export const createPreviewPageContext = (previewData) => {
  const context = {
    sections: updateSections(previewData.sections),
  };

  return context;
};
