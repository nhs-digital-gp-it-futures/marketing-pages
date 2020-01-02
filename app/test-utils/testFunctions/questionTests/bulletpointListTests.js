import { Selector } from 'testcafe';

const bulletpointListTest = async ({ pageSetup, sectionManifest, questionId }) => {
  const { maxItems } = sectionManifest.questions[questionId];
  await test(`should render ${maxItems} text fields for the ${questionId} question`, async (t) => {
    await pageSetup({ t });
    await Promise.all(Array(maxItems).fill().map(async (_, i) => {
      const theField = Selector(`[data-test-id="field-${questionId}-${i + 1}"]`);
      await t
        .expect(theField.find('input').count).eql(1);
    }));
  });
};

const populateBulletpointListTest = async ({
  pageSetup,
  questionId,
  data,
}) => {
  await test(`should populate the text fields in ${questionId} question bulletpoint list with existing data`, async (t) => {
    pageSetup({ t, responseBody: data });
    const existingFeatures = data.listing;
    await Promise.all(existingFeatures.map(async (existingFeature, i) => {
      const theField = Selector(`[data-test-id="field-${questionId}-${i + 1}"]`);
      await t
        .expect(theField.find('input').value).eql(existingFeature);
    }));
  });
};

export const runBulletpointListTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  data,
}) => {
  await Promise.all([
    bulletpointListTest({ pageSetup, sectionManifest, questionId }),
    populateBulletpointListTest({ pageSetup, questionId, data }),
  ]);
};
