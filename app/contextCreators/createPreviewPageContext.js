import { getMarketingDataForQuestion } from '../helpers/getMarketingDataForQuestion';

const addTitleIfProvided = questionManifest => (
  questionManifest.preview
    && questionManifest.preview.title ? questionManifest.preview.title : undefined
);

const shouldQuestionBeAddedToPreviewContext = (questionManifest, questionData) => {
  const questionRequirment = questionManifest.requirement ? questionManifest.requirement : 'Optional';
  return (questionRequirment === 'Optional' && questionData) || (questionRequirment === 'Mandatory');
};

const overrideQuestionTypeIfApplicable = questionManifest => (
  questionManifest.preview
    && questionManifest.preview.type ? questionManifest.preview.type : questionManifest.type
);

const createQuestionContext = (questionManifest, questionData) => ({
  id: questionManifest.id,
  title: addTitleIfProvided(questionManifest),
  type: overrideQuestionTypeIfApplicable(questionManifest),
  data: questionData,
});

const shouldSectionBeAddedToPreviewContext = questions => questions.length > 0;

const createSectionContext = (sectionManifest, questions) => ({
  title: sectionManifest.title,
  questions,
});

export const createPreviewPageContext = (previewManifest, existingSolutionData) => {
  const sections = [];

  previewManifest.map((sectionManifest) => {
    const questions = [];

    sectionManifest.questions.map((questionManifest) => {
      const questionData = getMarketingDataForQuestion(
        existingSolutionData, sectionManifest.id, questionManifest.id, questionManifest.type,
      );

      if (shouldQuestionBeAddedToPreviewContext(questionManifest, questionData)) {
        const question = createQuestionContext(questionManifest, questionData);
        questions.push(question);
      }
    });

    if (shouldSectionBeAddedToPreviewContext(questions)) {
      const section = createSectionContext(sectionManifest, questions);
      sections.push(section);
    }
  });

  const context = {
    sections,
  };

  return context;
};
