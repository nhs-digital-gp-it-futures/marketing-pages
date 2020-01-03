import { Selector } from 'testcafe';

const textAreaTest = async ({ pageSetup, sectionManifest, questionId }) => {
  await test(`should render the ${questionId} text area question`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    await t
      .expect(renderedQuestion.find('label.nhsuk-label').innerText).eql(expectedQuestion.mainAdvice)
      .expect(renderedQuestion.find('span.nhsuk-hint').innerText).eql(expectedQuestion.additionalAdvice)
      .expect(renderedQuestion.find('textarea').count).eql(1)
      .expect(renderedQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql(expectedQuestion.footerAdvice);
  });
};

const populateTextAreaTest = async ({ pageSetup, questionId, data }) => {
  await test(`should populate the ${questionId} text area question with existing data`, async (t) => {
    await pageSetup({ t, responseBody: data });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    await t
      .expect(renderedQuestion.find('textarea').value).eql(data[questionId]);
  });
};

export const runtextAreaTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  await Promise.all([
    textAreaTest({ pageSetup, sectionManifest, questionId }),
    populateTextAreaTest({ pageSetup, questionId, data }),
  ]);
};
