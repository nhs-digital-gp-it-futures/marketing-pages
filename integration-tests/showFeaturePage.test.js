import nock from 'nock';
import { Selector } from 'testcafe';
import { ManifestProvider } from '../app/forms/manifestProvider';
import aSolutionFixture from './fixtures/aSolution.json';
import aSolutionWithMarketingDataFixture from './fixtures/aSolutionWithMarketingData.json';


const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:5000')
      .get('/api/v1/solution/S100000-001')
      .reply(200, aSolutionWithMarketingDataFixture);
  } else {
    nock('http://localhost:5000')
      .get('/api/v1/solution/S100000-001')
      .reply(200, aSolutionFixture);
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/S100000-001/task/features');
};

fixture('Show Feature page');

test('should render the Features page title', async (t) => {
  pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Features');
});

test('should render main advice of question', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="task-question-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add up to 10 features that describe your Solution.');
});

test('should render all the advice of question', async (t) => {
  pageSetup(t);

  const taskManifest = new ManifestProvider().getTaskManifest('features');
  const expectedAdditionalAdvice = taskManifest.questions[0].additionalAdvice.join('\n');

  const additionalAdvice = Selector('[data-test-id="task-question-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render 10 text fields', async (t) => {
  pageSetup(t);

  await Promise.all(Array(10).fill().map(async (_, i) => {
    const theField = Selector(`[data-test-id="features-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').count).eql(1);
  }));
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const existingFeatures = aSolutionWithMarketingDataFixture.solution.marketingData.tasks[0].data['features-listing'];

  await Promise.all(existingFeatures.map(async (existingFeature, i) => {
    const theField = Selector(`[data-test-id="features-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').value).eql(existingFeature);
  }));
});

test('should render the submit button', async (t) => {
  pageSetup(t);

  const submitButton = Selector('[data-test-id="task-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1);
});
