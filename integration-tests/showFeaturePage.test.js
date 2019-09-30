import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../app/forms/manifestProvider';
import aSolutionFixture from './fixtures/aSolution.json';
import aSolutionWithMarketingDataFixture from './fixtures/aSolutionWithMarketingData.json';


const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionWithMarketingDataFixture);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionFixture);
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/S100000-001/section/features');
};

fixture('Show Feature page');

test('should render the Features page title', async (t) => {
  pageSetup(t);

  const title = Selector('h2');

  await t
    .expect(title.innerText).eql('Features');
});

test('should render main advice of question', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-question-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add up to 10 features that describe your Solution.');
});

test('should render all the advice of question', async (t) => {
  pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest('features');
  const expectedAdditionalAdvice = sectionManifest.questions[0].additionalAdvice.join('\n');

  const additionalAdvice = Selector('[data-test-id="section-question-additional-advice"]');

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

  const existingFeatures = aSolutionWithMarketingDataFixture.solution.marketingData.sections[0].data['features-listing'];

  await Promise.all(existingFeatures.map(async (existingFeature, i) => {
    const theField = Selector(`[data-test-id="features-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').value).eql(existingFeature);
  }));
});

test('should render the submit button', async (t) => {
  pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1);
});

test('should allow posting an empty form and navigate back to the dashboard when clicking the submit button', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .twice()
    .reply(200, aSolutionFixture);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001')
    .twice()
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await Promise.all(Array(10).fill().map(async (_, i) => {
    const theField = Selector(`[data-test-id="features-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').value).eql('');
  }));

  await t
    .click(submitButton.find('button'))
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('S100000-001');
});

test('should show validation for fields exceeding the maxLength', async (t) => {
  pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const firstField = Selector('[data-test-id="features-listing-1"]');
  const secondField = Selector('[data-test-id="features-listing-2"]');
  const thirdField = Selector('[data-test-id="features-listing-3"]');

  await t
    .typeText(firstField.find('input'), 'good')
    .typeText(secondField.find('input'), 'good')
    .typeText(thirdField.find('input'), 'a'.repeat(101))
    .click(submitButton.find('button'))
    .expect(firstField.find('.nhsuk-form-group--error').exists).notOk()
    .expect(secondField.find('.nhsuk-form-group--error').exists).notOk()
    .expect(thirdField.find('.nhsuk-form-group--error').exists).ok()
    .expect(thirdField.find('.nhsuk-error-message').innerText).eql('Error:\nsome validation error message');
});
