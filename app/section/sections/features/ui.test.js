import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const featuresMarketingData = {
  listing: [
    'Feature A',
    'Feature B',
    'Feature C',
  ],
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/features')
      .reply(200, featuresMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/features')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/S100000-001/section/features');
};

fixture('Show Feature page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the Features page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Features');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add up to 10 features that describe your Solution.');
});

test('should render all the advice of section', async (t) => {
  await pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest('features');
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render 10 text fields', async (t) => {
  await pageSetup(t);

  await Promise.all(Array(10).fill().map(async (_, i) => {
    const theField = Selector(`[data-test-id="field-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').count).eql(1);
  }));
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const existingFeatures = featuresMarketingData.listing;

  await Promise.all(existingFeatures.map(async (existingFeature, i) => {
    const theField = Selector(`[data-test-id="field-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').value).eql(existingFeature);
  }));
});

test('should render the submit button', async (t) => {
  await pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql('Save and return to all sections');
});

test('should allow posting an empty form and navigate back to the dashboard when clicking the submit button', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/dashboard')
    .reply(200, dashboardWithCompleteSections);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/features')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await Promise.all(Array(10).fill().map(async (_, i) => {
    const theField = Selector(`[data-test-id="field-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').value).eql('');
  }));

  await t
    .click(submitButton.find('button'))
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('S100000-001');
});

test('should show validation for fields exceeding the maxLength', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/features')
    .reply(400, {
      maxLength: ['listing-1', 'listing-3'],
    });

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const firstField = Selector('[data-test-id="field-listing-1"]');
  const firstFieldError = Selector('[data-test-id="field-error-listing-1"]');
  const secondField = Selector('[data-test-id="field-listing-2"]');
  const thirdField = Selector('[data-test-id="field-listing-3"]');
  const thirdFieldError = Selector('[data-test-id="field-error-listing-3"]');

  await t
    .expect(errorSummary.exists).notOk()
    .typeText(firstField.find('input'), 'a'.repeat(101), { paste: true })
    .typeText(secondField.find('input'), 'good', { paste: true })
    .typeText(thirdField.find('input'), 'a'.repeat(101), { paste: true })
    .click(submitButton.find('button'))

    .expect(errorSummaryList.find('li').count).eql(2)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('This feature is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#listing-1')
    .expect(errorSummaryList.find('li:nth-child(2)').innerText).eql('This feature is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(2) a').getAttribute('href')).eql('#listing-3')

    .expect(firstField.exists).notOk()
    .expect(firstFieldError.exists).ok()
    .expect(firstFieldError.find('.nhsuk-error-message').innerText).eql('Error:\nThis feature is over the character limit')
    .expect(secondField.find('.nhsuk-form-group--error').exists).notOk()
    .expect(thirdField.exists).notOk()
    .expect(thirdFieldError.exists).ok()
    .expect(thirdFieldError.find('.nhsuk-error-message').innerText).eql('Error:\nThis feature is over the character limit');
});

test('should goto anchor when clicking the feature max length summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/features')
    .reply(400, {
      maxLength: ['listing-1'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#listing-1')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/S100000-001/section/features#listing-1');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="section-back-link"] a');

  await t
    .expect(link.innerText).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/dashboard')
    .reply(200, dashboardWithCompleteSections);

  const getLocation = ClientFunction(() => document.location.href);

  const link = Selector('[data-test-id="section-back-link"]');

  await t
    .click(link.find('a'))
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('S100000-001');
});
