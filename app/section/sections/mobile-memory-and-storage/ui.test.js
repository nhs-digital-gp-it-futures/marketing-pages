import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const mobileConnectionData = {
  "minimum-memory-requirement": "256MB",
  "storage-requirements-description": "Text"
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/mobile-memory-and-storage')
      .reply(200, mobileConnectionData);
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

fixture.only('Mobile memory and storage page')
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

  const minimumConnectionSpeedQuestion = Selector('[data-test-id="combobox-options-minimum-memory-requirement"]');

  await t
    .expect(minimumConnectionSpeedQuestion.find('.nhsuk-label').innerText).eql('Select the minimum memory requirement for your Solution to function?')
    .expect(minimumConnectionSpeedQuestion.find('.nhsuk-hint').innerText).eql('Please select below the minimum memory requirement.')
    .expect(minimumConnectionSpeedQuestion.find('select').exists).ok()
    .expect(minimumConnectionSpeedQuestion.find('option').count).eql(8);
});

test('should populate connection speed question with existing data', async (t) => {
  pageSetup(t, true);

  const minimumConnectionSpeedQuestion = Selector('[data-test-id="combobox-options-minimum-memory-requirement"]');

  await t
    .expect(minimumConnectionSpeedQuestion.find('option[selected]').exists).ok()
    .expect(minimumConnectionSpeedQuestion.find('option[selected]').getAttribute('value')).eql('256MB')
});

test('should render storage requirements description question', async (t) => {
  await pageSetup(t);

  const connectionRequirementDescription = Selector('[data-test-id="question-storage-requirements-description"]');

  await t
    .expect(connectionRequirementDescription.find('label.nhsuk-label').innerText).eql('Description of storage requirements')
    .expect(connectionRequirementDescription.find('span.nhsuk-hint').innerText).eql('Add further information about the storage requirements needed for your Solution to function.')
    .expect(connectionRequirementDescription.find('textarea').count).eql(1)
    .expect(connectionRequirementDescription.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 300 characters');
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="question-storage-requirements-description"]').find('textarea').value).eql('Text');
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
