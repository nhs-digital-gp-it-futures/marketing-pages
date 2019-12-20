import { Selector } from 'testcafe';

const radioButtonsTest = ({ pageSetup, sectionManifest, questionId }) => {
  test(`should render the ${questionId} radio buttons question`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    const numberOfRadioButtons = Object.keys(expectedQuestion.options).length;
    await t
      .expect(renderedQuestion.find('.nhsuk-fieldset__legend').innerText).eql(expectedQuestion.mainAdvice)
      .expect(renderedQuestion.find('.nhsuk-hint').innerText).eql(expectedQuestion.additionalAdvice)
      .expect(renderedQuestion.find('.nhsuk-radios').count).eql(1)
      .expect(renderedQuestion.find('.nhsuk-radios__item').count).eql(numberOfRadioButtons);

    Object.keys(expectedQuestion.options).map(async (option) => {
      const text = expectedQuestion.options[option];
      const checkbox = Selector(`[data-test-id="question-${questionId}"] .nhsuk-radios__item`).withText(text);
      await t
        .expect(checkbox.innerText).eql(expectedQuestion.options[option]);
    });
  });
};

const populateRadioButtonsTest = ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  test(`should populate the ${questionId} radio buttons question with existing data`, async (t) => {
    const expectedQuestion = sectionManifest.questions[questionId];
    const selectedOption = expectedQuestion.options[data[questionId]];
    await pageSetup({ t, responseBody: data });
    Object.keys(expectedQuestion.options).map(async (option) => {
      const text = expectedQuestion.options[option];
      if (text === selectedOption) {
        const radioButton = Selector(`[data-test-id="question-${questionId}"] .nhsuk-radios__item`).withText(text);
        await t
          .expect(radioButton.find('input:checked').exists).ok();
      } else {
        const radioButton = Selector(`[data-test-id="question-${questionId}"] .nhsuk-radios__item`).withText(text);
        await t
          .expect(radioButton.find('input:checked').exists).notOk();
      }
    });
  });
};

export const runRadioButtonTests = ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  radioButtonsTest({ pageSetup, sectionManifest, questionId });
  populateRadioButtonsTest({
    pageSetup,
    sectionManifest,
    questionId,
    data,
  });
};
