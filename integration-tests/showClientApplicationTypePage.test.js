import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../app/forms/manifestProvider';

const clientApplicationTypeMarketingData = {
  'client-application-types': [
    'browser-based',
    'native-mobile',
    'native-desktop',
  ],
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/client-application-types')
      .reply(200, clientApplicationTypeMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/client-application-types')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/S100000-001/section/client-application-types');
};

fixture('Show Client Application Type page');

test('should render the Client Application Type page title', async (t) => {
  pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Client application type');
});

test('should render main advice of section', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Select all client application types your Solution supports');
});

test('should render all the advice of the section', async (t) => {
  pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest('client-application-types');
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the warning advise', async (t) => {
  pageSetup(t);

  const warningAdvice = Selector('[data-test-id="section-warning-advice"]');

  await t
    .expect(warningAdvice.count).eql(1)
    .expect(warningAdvice.innerText).eql('When revisiting this section please be aware that if you choose to deselect an application type, any data that has been added to that application type will be deleted.');
});

test('should render the select supported client application types question', async (t) => {
  pageSetup(t);

  const clientApplicationTypesQuestion = Selector('[data-test-id="checkbox-options-client-application-types"]');

  await t
    .expect(clientApplicationTypesQuestion.find('.nhsuk-fieldset__legend').innerText).eql('Select the client application types your Solution supports *')
    .expect(clientApplicationTypesQuestion.find('.nhsuk-hint').innerText).eql('Check all the options that are relevant to you. You will be required to provide further information for each client application type you select.')
    .expect(clientApplicationTypesQuestion.find('.nhsuk-checkboxes').count).eql(1)
    .expect(clientApplicationTypesQuestion.find('.nhsuk-checkboxes__item').count).eql(3);
});

test('should populate the checkboxes with existing data', async (t) => {
  pageSetup(t, true);

  const clientApplicationTypesQuestion = Selector('[data-test-id="checkbox-options-client-application-types"]');
  const browerBasedCheckbox = clientApplicationTypesQuestion.find('.nhsuk-checkboxes__item:nth-child(1)');
  const nativeMobileCheckbox = clientApplicationTypesQuestion.find('.nhsuk-checkboxes__item:nth-child(2)');
  const nativeDesktopCheckbox = clientApplicationTypesQuestion.find('.nhsuk-checkboxes__item:nth-child(3)');

  await t
    .expect(browerBasedCheckbox.find('input:checked').exists).ok()
    .expect(nativeMobileCheckbox.find('input:checked').exists).ok()
    .expect(nativeDesktopCheckbox.find('input:checked').exists).ok();
});

test('should render the submit button', async (t) => {
  pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1);
});
