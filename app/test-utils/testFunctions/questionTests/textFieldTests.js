import { Selector } from 'testcafe';
import { extractInnerText } from 'buying-catalogue-library';

const textFieldTest = async ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionParent,
}) => {
  let modifiedQuestionId = questionId;
  if (sectionParent) modifiedQuestionId = `${sectionParent}[${questionId}]`;
  await test(`should render ${modifiedQuestionId} text field`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${modifiedQuestionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    const label = renderedQuestion.find('label.nhsuk-label');
    const hint = renderedQuestion.find('span.nhsuk-hint');

    if (expectedQuestion.mainAdvice) {
      await t
        .expect(await extractInnerText(label)).eql(expectedQuestion.mainAdvice);
    }
    if (expectedQuestion.additionalAdvice) {
      await t
        .expect(await extractInnerText(hint)).eql(expectedQuestion.additionalAdvice);
    }
    await t
      .expect(renderedQuestion.find('input').count).eql(1);
  });
};

const populateTextFieldTest = async ({
  pageSetup,
  questionId,
  data,
  sectionParent,
}) => {
  let modifiedQuestionId = questionId;
  if (sectionParent) modifiedQuestionId = `${sectionParent}[${questionId}]`;
  await test(`should populate the ${modifiedQuestionId} text field question with existing data`, async (t) => {
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

export const runTextFieldTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
  sectionParent,
}) => {
  await Promise.all([
    textFieldTest({
      pageSetup,
      sectionManifest,
      questionId,
      sectionParent,
    }),
    populateTextFieldTest({
      pageSetup,
      questionId,
      data,
      sectionParent,
    }),
  ]);
};
