import { Selector } from 'testcafe';
import { extractInnerText } from 'buying-catalogue-library';


const radioButtonsTest = async ({ pageSetup, sectionManifest, questionId }) => {
  await test(`should render the ${questionId} radio buttons question`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    const numberOfRadioButtons = Object.keys(expectedQuestion.options).length;
    const hint = renderedQuestion.find('.nhsuk-hint');

    await t
      .expect(await extractInnerText(renderedQuestion.find('.nhsuk-fieldset__legend'))).eql(expectedQuestion.mainAdvice)
      .expect(await extractInnerText(hint)).eql(expectedQuestion.additionalAdvice)
      .expect(renderedQuestion.find('.nhsuk-radios').count).eql(1)
      .expect(renderedQuestion.find('.nhsuk-radios__item').count).eql(numberOfRadioButtons);

    await Promise.all(Object.keys(expectedQuestion.options).map(async (option) => {
      const text = expectedQuestion.options[option];
      const checkbox = await Selector(`[data-test-id="question-${questionId}"] .nhsuk-radios__item`).withText(text);
      await t
        .expect(checkbox.exists).ok();
    }));
  });
};

const populateRadioButtonsTest = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  await test(`should populate the ${questionId} radio buttons question with existing data`, async (t) => {
    const expectedQuestion = sectionManifest.questions[questionId];
    const selectedOption = expectedQuestion.options[data[questionId]];
    await pageSetup({ t, responseBody: data });
    await Promise.all(Object.keys(expectedQuestion.options).map(async (option) => {
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
    }));
  });
};

export const runRadioButtonTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  await Promise.all([
    radioButtonsTest({ pageSetup, sectionManifest, questionId }),
    populateRadioButtonsTest({
      pageSetup,
      sectionManifest,
      questionId,
      data,
    }),
  ]);
};
