import { Selector } from 'testcafe';
import { extractInnerText } from 'buying-catalogue-library';

const checkboxTest = async ({ pageSetup, sectionManifest, questionId }) => {
  await test(`should render the ${questionId} checkbox question`, async (t) => {
    await pageSetup({ t });
    const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
    const expectedQuestion = sectionManifest.questions[questionId];
    const options = Object.keys(expectedQuestion.options);
    const label = renderedQuestion.find('.nhsuk-fieldset__legend');
    const hint = await renderedQuestion.find('.nhsuk-hint');

    await t
      .expect(await extractInnerText(label)).eql(expectedQuestion.mainAdvice)
      .expect(await extractInnerText(hint)).eql(expectedQuestion.additionalAdvice)
      .expect(renderedQuestion.find('.nhsuk-checkboxes').count).eql(1)
      .expect(renderedQuestion.find('.nhsuk-checkboxes__item').count).eql(options.length);

    await Promise.all(options.map(async (option) => {
      const text = expectedQuestion.options[option];
      const checkbox = await Selector(`[data-test-id="question-${questionId}"] .nhsuk-checkboxes__item`).withText(text);
      await t
        .expect(checkbox.exists).ok();
    }));
  });
};

const populateCheckboxTest = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  await test(`should populate the ${questionId} checkbox question with existing data`, async (t) => {
    const expectedQuestion = sectionManifest.questions[questionId];
    const selectedOptions = data[questionId];
    const questionSelector = await Selector(`[data-test-id="question-${questionId}"]`);

    await pageSetup({ t, responseBody: data });

    await t
      .expect(questionSelector.find('input:checked').count).eql(selectedOptions.length);

    await Promise.all(Object.keys(expectedQuestion.options).map(async (option) => {
      const optionText = expectedQuestion.options[option];
      const checkbox = await Selector(`[data-test-id="question-${questionId}"]`).find('.nhsuk-checkboxes__item').withText(optionText);

      if (selectedOptions.includes(option)) {
        await t
          .expect(checkbox.find('input:checked').exists).ok();
      } else {
        await t
          .expect(checkbox.find('input:checked').exists).notOk();
      }
    }));
  });
};
export const runCheckboxTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  await Promise.all([
    checkboxTest({ pageSetup, sectionManifest, questionId }),
    populateCheckboxTest({
      pageSetup,
      sectionManifest,
      questionId,
      data,
    }),
  ]);
};
