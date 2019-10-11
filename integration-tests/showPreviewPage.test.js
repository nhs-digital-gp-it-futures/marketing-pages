import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import aSolutionFixture from './fixtures/aSolution.json';
import aSolutionWithMarketingDataFixture from './fixtures/aSolutionWithMarketingData.json';
import { ManifestProvider } from '../app/forms/manifestProvider';


const mocks = (isFirstLoad) => {
  if (isFirstLoad) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionFixture);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionWithMarketingDataFixture);
  }
};

const pageSetup = async (t, isFirstLoad = true) => {
  mocks(isFirstLoad);
  await t.navigateTo('http://localhost:1234/S100000-001/preview');
};

fixture('Show marketing preview page');

test('should render the marketing preview page title', async (t) => {
  pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Preview Page');
});

test('when no existing marketing data - The solution description section should just render the section heading and summary title', async (t) => {
  pageSetup(t);

  const solutionDescriptionSection = Selector('[data-test-id="preview-section-solution-description"]');
  const summaryQuestion = Selector('[data-test-id="preview-section-question-solution-summary"]');
  const descriptionQuestion = Selector('[data-test-id="preview-section-question-solution-description"]');
  const linkQuestion = Selector('[data-test-id="preview-section-question-solution-link"]');


  await t
    .expect(solutionDescriptionSection.exists).ok()
    .expect(solutionDescriptionSection.find('h3').innerText).eql('Solution description')
    .expect(summaryQuestion.exists).ok()
    .expect(summaryQuestion.find('[data-test-id="preview-question-title"]').innerText).eql('Summary')
    .expect(summaryQuestion.find('[data-test-id="preview-question-data"]').innerText).eql('')
    .expect(descriptionQuestion.exists).notOk()
    .expect(linkQuestion.exists).notOk();
});

test('when no existing marketing data - The features section should not be rendered', async (t) => {
  pageSetup(t);
  const featuresSection = Selector('[data-test-id="preview-section-features"]');

  await t
    .expect(featuresSection.exists).notOk();
});
