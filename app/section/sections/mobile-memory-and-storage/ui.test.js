import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const mobileMemoryAndStorageData = {
  "minimum-memory-requirement": "256MB",
  "storage-requirements-description": "Some storage requirements description"
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/mobile-memory-and-storage')
      .reply(200, mobileMemoryAndStorageData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/mobile-memory-and-storage')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/section/mobile-memory-and-storage');
};

fixture('Mobile memory and storage page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render memory and storage page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');
  await t
    .expect(title.innerText).eql('Native mobile or tablet - memory and storage requirements');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Answer the following questions about your mobile or tablet based Solution');
});

test('should render all the advice of the section', async (t) => {
  await pageSetup(t);

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql('This information will be visible to buyers on your Solution page.');
});

test('should render minimum memory requirement question', async (t) => {
  pageSetup(t);

  const minimumMemoryRequirementQuestion = Selector('[data-test-id="combobox-options-minimum-memory-requirement"]');

  await t
    .expect(minimumMemoryRequirementQuestion.find('.nhsuk-label').innerText).eql('Select the minimum memory requirement for your Solution to function?')
    .expect(minimumMemoryRequirementQuestion.find('.nhsuk-hint').innerText).eql('Please select below the minimum memory requirement.')
    .expect(minimumMemoryRequirementQuestion.find('select').exists).ok()
    .expect(minimumMemoryRequirementQuestion.find('option').count).eql(8);
});

test('should populate minimum memory requirement question with existing data', async (t) => {
  pageSetup(t, true);

  const minimumMemoryRequirementQuestion = Selector('[data-test-id="combobox-options-minimum-memory-requirement"]');

  await t
    .expect(minimumMemoryRequirementQuestion.find('option[selected]').exists).ok()
    .expect(minimumMemoryRequirementQuestion.find('option[selected]').getAttribute('value')).eql('256MB')
});

test('should show error summary and validation for minimum memory requirement indicating it is mandatory', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/mobile-memory-and-storage')
    .reply(400, {
      required: ['minimum-memory-requirement'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const minimumMemoryRequirement = Selector('[data-test-id="combobox-options-minimum-memory-requirement"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Minimum memory requirement is a mandatory question')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#minimum-memory-requirement')
    .expect(minimumMemoryRequirement.find('[data-test-id="combobox-options-error"]').exists).ok()
    .expect(minimumMemoryRequirement.find('.nhsuk-error-message').innerText).eql('Error:\nMinimum memory requirement is a mandatory question');
});

test('should render storage requirements description question', async (t) => {
  await pageSetup(t);

  const storageRequirementsDescription = Selector('[data-test-id="question-storage-requirements-description"]');

  await t
    .expect(storageRequirementsDescription.find('label.nhsuk-label').innerText).eql('Description of storage requirements')
    .expect(storageRequirementsDescription.find('span.nhsuk-hint').innerText).eql('Add further information about the storage requirements needed for your Solution to function.')
    .expect(storageRequirementsDescription.find('textarea').count).eql(1)
    .expect(storageRequirementsDescription.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 300 characters');
});

test('should populate the storage requirements description with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="question-storage-requirements-description"]').find('textarea').value).eql('Some storage requirements description');
});

test('should show error summary and validation for storage requirements description indicating it is mandatory', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/mobile-memory-and-storage')
    .reply(400, {
      required: ['storage-requirements-description'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const storageRequirementsDescription = Selector('[data-test-id="question-storage-requirements-description"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Storage requirement description is a mandatory question')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#storage-requirements-description')
    .expect(storageRequirementsDescription.find('.nhsuk-textarea--error').exists).ok()
    .expect(storageRequirementsDescription.find('.nhsuk-error-message').innerText).eql('Error:\nStorage requirement description is a mandatory question');
});

test('should show error summary and validation for storage requirements description question it exceeds the maxLength', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/mobile-memory-and-storage')
    .reply(400, {
      maxLength: ['storage-requirements-description'],
    });

  const oneHundredCharacters = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
  const threeHundredCharacters = oneHundredCharacters.repeat(3);

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const storageRequirementsDescription = Selector('[data-test-id="question-storage-requirements-description"]');

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .typeText(storageRequirementsDescription, `${threeHundredCharacters}0`, { paste: true })
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Storage requirement description is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#storage-requirements-description')
    .expect(storageRequirementsDescription.find('.nhsuk-textarea--error').exists).ok()
    .expect(storageRequirementsDescription.find('.nhsuk-error-message').innerText).eql('Error:\nStorage requirement description is over the character limit')
});

test('should render the submit button', async (t) => {
  await pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql('Save and return');
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
    .expect(getLocation()).contains('solution/S100000-001');
});

test('should goto the native mobile dashboard when clicking the submit button', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/mobile-memory-and-storage')
    .reply(200, {});

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/native-mobile')
    .reply(200, {});

  const submitButton = Selector('[data-test-id="section-submit-button"] button');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click(submitButton)
    .expect(getLocation()).contains('solution/S100000-001/dashboard/native-mobile');
});
