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

  const title = Selector('[data-test-id="section-title"]');

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

  const summaryQuestion = Selector('[data-test-id="textarea-field-summary"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Summarise your Solution *')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('Your text from Stage 1, Solution registration has been automatically inserted but can be edited.')
    .expect(summaryQuestion.find('textarea').count).eql(1)
    .expect(summaryQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 300 characters');
});

test('should render the about your solution question', async (t) => {
  pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="textarea-field-description"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Write a description about your Solution')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('The description will give the buyer more insight into your Solution and the qualities it can provide.')
    .expect(summaryQuestion.find('textarea').count).eql(1)
    .expect(summaryQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 1000 characters');
});

test('should render the solution link field', async (t) => {
  pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="text-field-link"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Enter a link to more Solution information')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('Buyers will be directed to an external link.')
    .expect(summaryQuestion.find('input').count).eql(1);
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="textarea-field-summary"]').find('textarea').value).eql('The solution summary')
    .expect(theQuestions.find('[data-test-id="textarea-field-description"]').find('textarea').value).eql('The solution description')
    .expect(theQuestions.find('[data-test-id="text-field-link"]').find('input').value).eql('The solution link');
});

test('should allow posting an empty form and navigate back to the dashboard', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .reply(200, aSolutionFixture);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/solution-description')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .click(submitButton.find('button'))
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('S100000-001');
});

test('should show error summary and validation for questions when they exceed the maxLength', async (t) => {
  pageSetup(t);

  const oneHundredCharacters = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
  const threeHundredCharacters = oneHundredCharacters.repeat(3);
  const thousandCharacters = oneHundredCharacters.repeat(10);

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const solutionSummary = Selector('[data-test-id="textarea-field-summary"]');
  const solutionDescription = Selector('[data-test-id="textarea-field-description"]');
  const solutionLink = Selector('[data-test-id="text-field-link"]');

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .typeText(solutionSummary, `${threeHundredCharacters}0`, { paste: true })
    .typeText(solutionDescription, `${thousandCharacters}0`, { paste: true })
    .typeText(solutionLink, `${thousandCharacters}0`, { paste: true })
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(3)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Solution Summary validation error message')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#summary')
    .expect(errorSummaryList.find('li:nth-child(2)').innerText).eql('Solution Description validation error message')
    .expect(errorSummaryList.find('li:nth-child(2) a').getAttribute('href')).eql('#description')
    .expect(errorSummaryList.find('li:nth-child(3)').innerText).eql('Solution Link validation error message')
    .expect(errorSummaryList.find('li:nth-child(3) a').getAttribute('href')).eql('#link')
    .expect(solutionSummary.find('.nhsuk-textarea--error').exists).ok()
    .expect(solutionSummary.find('.nhsuk-error-message').innerText).eql('Error:\nSolution Summary validation error message')
    .expect(solutionDescription.find('.nhsuk-textarea--error').exists).ok()
    .expect(solutionDescription.find('.nhsuk-error-message').innerText).eql('Error:\nSolution Description validation error message')
    .expect(solutionLink.find('.nhsuk-input--error').exists).ok()
    .expect(solutionLink.find('.nhsuk-error-message').innerText).eql('Error:\nSolution Link validation error message');
});
