export const doesQuestionHaveData = (question, sectionData) => {
  if (sectionData[question.id] && question.type === 'bulletpoint-list') {
    return sectionData[question.id].map((value) => {
      if (value.trim().length > 0) {
        return true;
      }
      return false;
    }).some(hasData => hasData);
  }

  if (sectionData[question.id] && question.type !== 'bulletpoint-list') {
    if (sectionData[question.id].trim().length > 0) {
      return true;
    }
    return false;
  }

  return false;
};

const createDataStateForQuestions = (sectionManifest, sectionData) => {
  const questionsState = [];
  sectionManifest.questions.map((question) => {
    const questionState = {};
    questionState.requirement = question.requirement;
    questionState.hasData = doesQuestionHaveData(question, sectionData);
    questionsState.push(questionState);
  });

  return questionsState;
};

const getMandatoryQuestions = questionsState => questionsState.filter(questionState => questionState.requirement === 'Mandatory');

const doesSectionHaveMandatoryQuestions = mandatoryQuestions => mandatoryQuestions.length > 0;

const determineStatusOfSectionWithMandatoryQuestions = (mandatoryQuestions) => {
  if (mandatoryQuestions.every(mandatoryQuestion => mandatoryQuestion.hasData)) {
    return 'COMPLETE';
  }
  return 'INCOMPLETE';
};

const determineStatusOfSectionWithAllOptionalQuestions = (questionsState) => {
  const optionalQuestionsWithData = questionsState.filter(questionState => questionState.requirement === 'Optional' && questionState.hasData);

  return optionalQuestionsWithData.length > 0 ? 'COMPLETE' : 'INCOMPLETE';
};

export const determineStatusForSection = (sectionManifest, sectionData) => {
  const questionsState = createDataStateForQuestions(sectionManifest, sectionData);

  const mandatoryQuestions = getMandatoryQuestions(questionsState);

  if (doesSectionHaveMandatoryQuestions(mandatoryQuestions)) {
    return determineStatusOfSectionWithMandatoryQuestions(mandatoryQuestions);
  }

  return determineStatusOfSectionWithAllOptionalQuestions(questionsState);
};
