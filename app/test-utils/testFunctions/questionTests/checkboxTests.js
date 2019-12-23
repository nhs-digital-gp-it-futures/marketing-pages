import { Selector } from 'testcafe';

const checkboxTest = ({ pageSetup, sectionManifest, questionId }) => {
  test(`should render the ${questionId} checkbox question`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    const options = Object.keys(expectedQuestion.options);
    await t
      .expect(renderedQuestion.find('.nhsuk-fieldset__legend').innerText).eql(expectedQuestion.mainAdvice)
      .expect(renderedQuestion.find('.nhsuk-hint').innerText).eql(expectedQuestion.additionalAdvice)
      .expect(renderedQuestion.find('.nhsuk-checkboxes').count).eql(1)
      .expect(renderedQuestion.find('.nhsuk-checkboxes__item').count).eql(options.length);

    options.forEach(async (option) => {
      const text = expectedQuestion.options[option];
      const checkbox = Selector(`[data-test-id="question-${questionId}"] .nhsuk-checkboxes__item`).withText(text);
      await t
        .expect(checkbox.innerText).eql(text);
    });
  });
};

const populateCheckboxTest = ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  test(`should populate the ${questionId} checkbox question with existing data`, async (t) => {
    const expectedQuestion = sectionManifest.questions[questionId];
    const selectedOptions = data[questionId];
    const questionSelector = Selector(`[data-test-id="question-${questionId}"]`);

    await pageSetup({ t, responseBody: data });

    await t.expect(questionSelector.find('input:checked').count).eql(selectedOptions.length);

    Object.keys(expectedQuestion.options).forEach(async (option) => {
      const checkbox = questionSelector.find('.nhsuk-checkboxes__item').withText(option);
      if (selectedOptions.includes(option)) {
        await t
          .expect(checkbox.find('input:checked').exists).ok();
      } else {
        await t
          .expect(checkbox.find('input:checked').exists).notOk();
      }
    });
  });
};
export const runCheckboxTests = ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  checkboxTest({ pageSetup, sectionManifest, questionId });
  populateCheckboxTest({
    pageSetup,
    sectionManifest,
    questionId,
    data,
  });
};
