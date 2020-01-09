import { Selector } from 'testcafe';

export const comboboxTest = async ({
  pageSetup,
  sectionManifest,
  questionId,
}) => {
  await test(`should render the ${questionId} combobox question`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    const options = Object.keys(expectedQuestion.options);
    const labelText = await renderedQuestion.find('.nhsuk-label').innerText;
    await t
      .expect(labelText.trim()).eql(expectedQuestion.mainAdvice)
      .expect(renderedQuestion.find('.nhsuk-hint').innerText).eql(expectedQuestion.additionalAdvice)
      .expect(renderedQuestion.find('select').exists).ok()
      .expect(renderedQuestion.find('option').count).eql(options.length);
    await Promise.all(options.map(async (option) => {
      const text = expectedQuestion.options[option];
      const renderedOption = Selector(`[data-test-id="question-${questionId}"] .nhsuk-select option`).withText(text);
      await t
        .expect(renderedOption.exists).ok();
    }));
  });
};

const populateComboboxTest = async ({
  pageSetup,
  questionId,
  data,
}) => {
  await test(`should populate the ${questionId} combobox question with existing data`, async (t) => {
    await pageSetup({ t, responseBody: data });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    await t
      .expect(renderedQuestion.find('option[selected]').exists).ok()
      .expect(renderedQuestion.find('option[selected]').getAttribute('value')).eql(data[questionId]);
  });
};

export const runComboboxTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  await Promise.all([
    comboboxTest({
      pageSetup,
      sectionManifest,
      questionId,
    }),
    populateComboboxTest({
      pageSetup,
      questionId,
      data,
    }),
  ]);
};
