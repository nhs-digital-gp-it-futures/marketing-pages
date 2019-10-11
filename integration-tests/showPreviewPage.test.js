import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import aSolutionFixture from './fixtures/aSolution.json';
import aSolutionWithMarketingDataFixture from './fixtures/aSolutionWithMarketingData.json';
import { ManifestProvider } from '../app/forms/manifestProvider';


const mocks = (existingData) => {
  if (!existingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionFixture);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionWithMarketingDataFixture);
  }
};

const pageSetup = async (t, existingData = false) => {
  mocks(existingData);
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

test('when existing marketing data - The solution description section and all questions should be rendered', async (t) => {
  pageSetup(t, true);

  const solutionDescriptionSection = Selector('[data-test-id="preview-section-solution-description"]');
  const summaryQuestion = Selector('[data-test-id="preview-section-question-solution-summary"]');
  const descriptionQuestion = Selector('[data-test-id="preview-section-question-solution-description"]');
  const linkQuestion = Selector('[data-test-id="preview-section-question-solution-link"]');


  await t
    .expect(solutionDescriptionSection.exists).ok()
    .expect(solutionDescriptionSection.find('h3').innerText).eql('Solution description')

    .expect(summaryQuestion.exists).ok()
    .expect(summaryQuestion.find('[data-test-id="preview-question-title"]').innerText).eql('Summary')
    .expect(summaryQuestion.find('[data-test-id="preview-question-data"]').innerText).eql('The solution summary')

    .expect(descriptionQuestion.exists).ok()
    .expect(descriptionQuestion.find('[data-test-id="preview-question-title"]').innerText).eql('About the solution')
    .expect(descriptionQuestion.find('[data-test-id="preview-question-data"]').innerText).eql('The solution description')

    .expect(linkQuestion.exists).ok()
    .expect(linkQuestion.find('[data-test-id="preview-question-title"]').exists).notOk()
    .expect(linkQuestion.find('[data-test-id="preview-question-data"]').innerText).eql('The solution link');
});

test('when no existing marketing data - The features section should not be rendered', async (t) => {
  pageSetup(t);
  const featuresSection = Selector('[data-test-id="preview-section-features"]');

  await t
    .expect(featuresSection.exists).notOk();
});

test('when existing marketing data - The features section should rendered and the features displayed', async (t) => {
  pageSetup(t, true);

  const featuresSection = Selector('[data-test-id="preview-section-features"]');
  const featureListingQuestion = Selector('[data-test-id="preview-section-question-features-listing"]');

  await t
    .expect(featuresSection.exists).ok()
    .expect(featuresSection.find('h3').innerText).eql('Features')

    .expect(featureListingQuestion.exists).ok()
    .expect(featureListingQuestion.find('[data-test-id="preview-question-title"]').exists).notOk()
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data"]').exists).ok()
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data"]').find('li').count).eql(3)
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data"]').find('li:nth-child(1)').innerText).eql('Feature A')
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data"]').find('li:nth-child(2)').innerText).eql('Feature B')
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data"]').find('li:nth-child(3)').innerText).eql('Feature C');
});
