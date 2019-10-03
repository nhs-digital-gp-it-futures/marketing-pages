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

test('should render the about your solution question', async (t) => {
  pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="textarea-field-solution-description"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Write a description about your Solution')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('The description will give the buyer more insight into your Solution and the qualities it can provide.')
    .expect(summaryQuestion.find('textarea').count).eql(1);
});

test('should render the solution link field', async (t) => {
  pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="text-field-solution-link"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Enter a link to more Solution information')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('Buyers will be directed to an external link.')
    .expect(summaryQuestion.find('input').count).eql(1);
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="textarea-field-solution-summary"]').find('textarea').value).eql('The solution summary')
    .expect(theQuestions.find('[data-test-id="textarea-field-solution-description"]').find('textarea').value).eql('The solution description')
    .expect(theQuestions.find('[data-test-id="text-field-solution-link"]').find('input').value).eql('The solution link');
});

test('should allow posting an empty form and navigate back to the dashboard', async (t) => {
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

  await t
    .click(submitButton.find('button'))
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('S100000-001');
});

test('should show validation for questions when they exceed the maxLength', async (t) => {
  pageSetup(t);

  const oneHundredCharacters = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
  const thousandCharacters = oneHundredCharacters.repeat(10);
  const threeThousandCharacters = thousandCharacters.repeat(3);


  const solutionSummary = Selector('[data-test-id="textarea-field-solution-summary"]');
  const solutionDescription = Selector('[data-test-id="textarea-field-solution-description"]');
  const solutionLink = Selector('[data-test-id="text-field-solution-link"]');

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .typeText(solutionSummary, `${thousandCharacters}0`, { paste: true })
    .typeText(solutionDescription, `${threeThousandCharacters}0`, { paste: true })
    .typeText(solutionLink, `${oneHundredCharacters}0`, { paste: true })
    .click(submitButton.find('button'))
    .expect(solutionSummary.find('.nhsuk-textarea--error').exists).ok()
    .expect(solutionDescription.find('.nhsuk-textarea--error').exists).ok()
    .expect(solutionLink.find('.nhsuk-input--error').exists).ok();
});
