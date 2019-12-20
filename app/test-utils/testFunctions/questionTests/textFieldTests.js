import { Selector } from 'testcafe';

const textFieldTest = ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionParent,
}) => {
  let modifiedQuestionId = questionId;
  if (sectionParent) modifiedQuestionId = `${sectionParent}[${questionId}]`;
  test(`should render ${modifiedQuestionId} text field`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${modifiedQuestionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];

    if (expectedQuestion.mainAdvice) {
      await t
        .expect(renderedQuestion.find('label.nhsuk-label').innerText).eql(expectedQuestion.mainAdvice);
    }
    if (expectedQuestion.additionalAdvice) {
      await t
        .expect(renderedQuestion.find('span.nhsuk-hint').innerText).eql(expectedQuestion.additionalAdvice);
    }
    await t
      .expect(renderedQuestion.find('input').count).eql(1);
  });
};

const populateTextFieldTest = ({
  pageSetup,
  questionId,
  data,
  sectionParent,
}) => {
  let modifiedQuestionId = questionId;
  if (sectionParent) modifiedQuestionId = `${sectionParent}[${questionId}]`;
  test(`should populate the ${modifiedQuestionId} text field question with existing data`, async (t) => {
    await pageSetup({ t, responseBody: data });
    const renderedQuestion = Selector(`[data-test-id="question-${modifiedQuestionId}"]`);
    if (sectionParent) {
      await t
        .expect(renderedQuestion.find('input').value).eql(data[sectionParent][questionId]);
    } else {
      await t
        .expect(renderedQuestion.find('input').value).eql(data[questionId]);
    }
  });
};

export const runTextFieldTests = ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
  sectionParent,
}) => {
  textFieldTest({
    pageSetup,
    sectionManifest,
    questionId,
    sectionParent,
  });
  populateTextFieldTest({
    pageSetup,
    questionId,
    data,
    sectionParent,
  });
};
