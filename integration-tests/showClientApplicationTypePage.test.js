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
  await t.navigateTo('http://localhost:1234/S100000-001/section/client-application-types');
};

fixture('Show Client Application Type page');

test('should render the Client Application Type page title', async (t) => {
  pageSetup(t);

  const title = Selector('h2');

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

test('should render the select supported client application types question', async (t) => {
  pageSetup(t);

  const clientApplicationTypesQuestion = Selector('[data-test-id="checkbox-options-clientApplicationTypes"]');

  await t
    .expect(clientApplicationTypesQuestion.find('.nhsuk-fieldset__legend').innerText).eql('Select the client application types your Solution supports *')
    .expect(clientApplicationTypesQuestion.find('.nhsuk-hint').innerText).eql('Check all the options that are relevant to you. You will be required to provide further information for each client application type you select.')
    .expect(clientApplicationTypesQuestion.find('.nhsuk-checkboxes').count).eql(1)
    .expect(clientApplicationTypesQuestion.find('.nhsuk-checkboxes__item').count).eql(3);
});
