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
  await t.navigateTo('http://localhost:1234/S100000-001/section/solution-description');
};

fixture('Show Solution Description page');

test('should render the Solution Description page title', async (t) => {
  pageSetup(t);

  const title = Selector('h2');

  await t
    .expect(title.innerText).eql('Solution description');
});

test('should render main advice of section', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add further detail about your Solution to provide the buyer with more information.');
});

test('should render all the advice of the section', async (t) => {
  pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest('solution-description');
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the solution summary question', async (t) => {
  pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="textarea-field-solution-summary"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Summarise your Solution *')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('Your text from Stage 1, Solution registration has been automatically inserted but can be edited.')
    .expect(summaryQuestion.find('textarea').count).eql(1);
});
