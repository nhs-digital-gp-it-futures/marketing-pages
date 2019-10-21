import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import aSolutionFixture from './fixtures/aSolution.json';
import aSolutionWithMarketingDataFixture from './fixtures/aSolutionWithMarketingData.json';


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
  await t.navigateTo('http://localhost:1234/S100000-001');
};

fixture('Show marketing dashboard page');

test('should render the marketing dashboard page title', async (t) => {
  pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Marketing Page - Dashboard');
});

test('should render the secondary preview page button', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .reply(200, aSolutionFixture);

  const getLocation = ClientFunction(() => document.location.href);

  const previewButton = Selector('[data-test-id="dashboard-preview-secondary-button"] a');

  await t
    .expect(previewButton.innerText).eql('Preview Marketing page')
    .click(previewButton)
    .expect(getLocation()).contains('S100000-001/preview');
});

test('should render the preview page button', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .reply(200, aSolutionFixture);

  const getLocation = ClientFunction(() => document.location.href);

  const previewButton = Selector('[data-test-id="dashboard-preview-button"] a');

  await t
    .expect(previewButton.innerText).eql('Preview Marketing page')
    .click(previewButton)
    .expect(getLocation()).contains('S100000-001/preview');
});

test('should render the About your solution section group', async (t) => {
  pageSetup(t);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-1"]');

  await t
    .expect(aboutYourSolutionSectionGroup.find('h2').innerText).eql('About your Solution');
});

test('should render the Client application type section group', async (t) => {
  pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-2"]');

  await t
    .expect(clientApplicationTypeSectionGroup.find('h2').innerText).eql('Client application type');
});

test('should render all the sections for the About your solution section group', async (t) => {
  pageSetup(t);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-1"]');
  const solutionDescriptionSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-solution-description"]');
  const featuresSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-features"]');

  await t
    .expect(solutionDescriptionSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Solution description')
    .expect(solutionDescriptionSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(solutionDescriptionSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(featuresSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Features')
    .expect(featuresSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(featuresSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});

test('should render all the sections for the Client application type section group', async (t) => {
  pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-2"]');

  await t
    .expect(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Client application type')
    .expect(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});

test('should render all the sub sections for the client application type section with the default message', async (t) => {
  pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-2"]');
  const clientApplicationTypeSection = clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-client-application-types"]');

  const browserBasedSubSection = clientApplicationTypeSection.find('[data-test-id="dashboard-sub-section-browser-based"]');
  const nativeMobileSubSection = clientApplicationTypeSection.find('[data-test-id="dashboard-sub-section-native-mobile"]');
  const nativeDesktopSubSection = clientApplicationTypeSection.find('[data-test-id="dashboard-sub-section-native-desktop"]');

  await t
    .expect(browserBasedSubSection.count).eql(1)
    .expect(browserBasedSubSection.find('a').exists).notOk()
    .expect(browserBasedSubSection.find('[data-test-id="dashboard-section-title"]').innerText).eql('Browser based')
    .expect(browserBasedSubSection.find('[data-test-id="dashboard-section-default-message"]').innerText).eql('Select from client application types')

    .expect(nativeMobileSubSection.count).eql(1)
    .expect(nativeMobileSubSection.find('a').exists).notOk()
    .expect(nativeMobileSubSection.find('[data-test-id="dashboard-section-title"]').innerText).eql('Native mobile or tablet')
    .expect(nativeMobileSubSection.find('[data-test-id="dashboard-section-default-message"]').innerText).eql('Select from client application types')

    .expect(nativeDesktopSubSection.count).eql(1)
    .expect(nativeDesktopSubSection.find('a').exists).notOk()
    .expect(nativeDesktopSubSection.find('[data-test-id="dashboard-section-title"]').innerText).eql('Native desktop')
    .expect(nativeDesktopSubSection.find('[data-test-id="dashboard-section-default-message"]').innerText).eql('Select from client application types');
});

test('clicking on the solution description section link should navigate the user to the solution description page', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .reply(200, aSolutionFixture);

  const getLocation = ClientFunction(() => document.location.href);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-1"]');
  const theSolutionDescriptionSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-solution-description"]');

  await t
    .click(theSolutionDescriptionSection.find('a'))
    .expect(getLocation()).contains('S100000-001/section/solution-description');
});


test('clicking on the feature section link should navigate the user to the features page', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .reply(200, aSolutionFixture);

  const getLocation = ClientFunction(() => document.location.href);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-1"]');
  const theFeatureSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-features"]');

  await t
    .click(theFeatureSection.find('a'))
    .expect(getLocation()).contains('S100000-001/section/feature');
});

test('clicking on the client application type section link should navigate the user to the client application type page', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .reply(200, aSolutionFixture);

  const getLocation = ClientFunction(() => document.location.href);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-2"]');
  const theClientApplicationTypeSection = clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-client-application-types"]');

  await t
    .click(theClientApplicationTypeSection.find('a'))
    .expect(getLocation()).contains('S100000-001/section/client-application-type');
});
