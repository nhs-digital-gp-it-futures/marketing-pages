import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const mobileConnectionData = {
  "minimum-connection-speed": "3Mbps",
  "connection-types": ["3G"],
  "connection-requirements-description": "Text"
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/mobile-connection-details')
      .reply(200, mobileConnectionData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/mobile-connection-details')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/S100000-001/section/mobile-connection-details');
};

fixture.only('Mobile connection details page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render mobile connection details page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Native mobile or tablet - connection details');
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

test('should render connection speed question', async (t) => {
  pageSetup(t);

  const minimumConnectionSpeedQuestion = Selector('[data-test-id="combobox-options-minimum-connection-speed"]');

  await t
    .expect(minimumConnectionSpeedQuestion.find('.nhsuk-label').innerText).eql('Select the minimum connection speed required for your Solution to function? (optional)')
    .expect(minimumConnectionSpeedQuestion.find('.nhsuk-hint').innerText).eql('Please select below the minimum bandwidth requirement.')
    .expect(minimumConnectionSpeedQuestion.find('select').exists).ok()
    .expect(minimumConnectionSpeedQuestion.find('option').count).eql(13);
});

test('should render the connection type question', async (t) => {
  await pageSetup(t);

  const connectionType = Selector('[data-test-id="question-connection-types"]');
  const GprsCheckbox = connectionType.find('.nhsuk-checkboxes__item:nth-child(1)');
  const ThreeGCheckbox = connectionType.find('.nhsuk-checkboxes__item:nth-child(2)');
  const LTECheckbox = connectionType.find('.nhsuk-checkboxes__item:nth-child(3)');
  const FourGCHeckbox = connectionType.find('.nhsuk-checkboxes__item:nth-child(4)');
  const FiveGCHeckbox = connectionType.find('.nhsuk-checkboxes__item:nth-child(5)');
  const BluetoothCheckbox = connectionType.find('.nhsuk-checkboxes__item:nth-child(6)');
  const WifiCheckbox = connectionType.find('.nhsuk-checkboxes__item:nth-child(7)');

  await t
    .expect(connectionType.find('.nhsuk-fieldset__legend').innerText).eql('What connection types are supported? (optional)')
    .expect(connectionType.find('.nhsuk-hint').innerText).eql('Please select below all the connection types your solution supports')
    .expect(connectionType.find('.nhsuk-checkboxes').count).eql(1)
    .expect(connectionType.find('.nhsuk-checkboxes__item').count).eql(7)

    .expect(GprsCheckbox.innerText).eql('GPRS')
    .expect(ThreeGCheckbox.innerText).eql('3G')
    .expect(LTECheckbox.innerText).eql('LTE')
    .expect(FourGCHeckbox.innerText).eql('4G')
    .expect(FiveGCHeckbox.innerText).eql('5G')
    .expect(BluetoothCheckbox.innerText).eql('Bluetooth')
    .expect(WifiCheckbox.innerText).eql('Wifi')
});

test('should render description of connection question', async (t) => {
  await pageSetup(t);

  const additionalInformation = Selector('[data-test-id="question-connection-requirements-description"]');

  await t
    .expect(additionalInformation.find('label.nhsuk-label').innerText).eql('Description of connection requirements (optional)')
    .expect(additionalInformation.find('span.nhsuk-hint').innerText).eql('Add further description of connectivity for your Solution.')
    .expect(additionalInformation.find('textarea').count).eql(1)
    .expect(additionalInformation.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 300 characters');
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="question-connection-requirements-description"]').find('textarea').value).eql('Text');
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
    .expect(getLocation()).contains('S100000-001');
});

test('should goto the native mobile dashboard when clicking the submit button', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/mobile-connection-details')
    .reply(200, {});

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/native-mobile')
    .reply(200, {});

  const submitButton = Selector('[data-test-id="section-submit-button"] button');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click(submitButton)
    .expect(getLocation()).contains('/S100000-001/dashboard/native-mobile');
});
