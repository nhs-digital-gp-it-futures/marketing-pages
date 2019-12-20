import { Selector } from 'testcafe';

export const comboboxTest = ({
  pageSetup,
  sectionManifest,
  questionId,
}) => {
  test(`should render the ${questionId} combobox question`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    const options = Object.keys(expectedQuestion.options);
    await t
      .expect(renderedQuestion.find('.nhsuk-label').innerText).eql(expectedQuestion.mainAdvice)
      .expect(renderedQuestion.find('.nhsuk-hint').innerText).eql(expectedQuestion.additionalAdvice)
      .expect(renderedQuestion.find('select').exists).ok()
      .expect(renderedQuestion.find('option').count).eql(options.length);
    options.forEach(async (option) => {
      const text = expectedQuestion.options[option];
      const renderedOption = Selector(`[data-test-id="question-${questionId}"] .nhsuk-select option`).withText(text);
      await t
        .expect(renderedOption.innerText).eql(text);
    });
  });
};

const populateComboboxTest = ({
  pageSetup,
  questionId,
  data,
}) => {
  test(`should populate the ${questionId} combobox question with existing data`, async (t) => {
    pageSetup({ t, responseBody: data });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    await t
      .expect(renderedQuestion.find('option[selected]').exists).ok()
      .expect(renderedQuestion.find('option[selected]').getAttribute('value')).eql(data[questionId]);
  });
};

export const runComboboxTests = ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  comboboxTest({
    pageSetup,
    sectionManifest,
    questionId,
  });
  populateComboboxTest({
    pageSetup,
    questionId,
    data,
  });
};
