import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithIncompleteSections from '../../fixtures/dashboardWithIncompleteSections.json';
import dashboardWithCompleteSections from '../../fixtures/dashboardWithCompleteSections.json';
import previewWithMarketingData from '../../fixtures/previewWithMarketingData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../test-utils/config';

const mocks = (initalDashboard) => {
  if (initalDashboard) {
    nock(apiLocalhost)
      .get(`${apiPath}/dashboard`)
      .reply(200, dashboardWithIncompleteSections);
  } else {
    nock(apiLocalhost)
      .get(`${apiPath}/dashboard`)
      .reply(200, dashboardWithCompleteSections);
  }
};

const pageSetup = async (t, initalDashboard = true) => {
  mocks(initalDashboard);
  await t.navigateTo(`${clientLocalhost}`);
};

fixture('Show marketing dashboard page');
// .afterEach(async (t) => {
//   const isDone = nock.isDone();
//   if (!isDone) {
//     nock.cleanAll();
// }
// await t.expect(isDone).ok('Not all nock interceptors were used!');
// });

test('should render the marketing dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Marketing Page - Dashboard');
});

test('should render the preview page button', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/preview`)
    .reply(200, previewWithMarketingData);

  const getLocation = ClientFunction(() => document.location.href);

  const previewButton = Selector('[data-test-id="dashboard-preview-button"] a');

  await t
    .expect(previewButton.innerText).eql('Preview Marketing page')
    .click(previewButton)
    .expect(getLocation()).contains('/solution/S100000-001/preview');
});

test('should render the Submit for moderation button', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .put(`${apiPath}/SubmitForReview`)
    .reply(204, {});

  nock(apiLocalhost)
    .get(`${apiPath}/dashboard`)
    .reply(200, dashboardWithIncompleteSections);

  const getLocation = ClientFunction(() => document.location.href);

  const submitForModerationButton = Selector('[data-test-id="dashboard-submit-for-moderation-button"] a');

  await t
    .expect(submitForModerationButton.innerText).eql('Submit for moderation')
    .click(submitForModerationButton)
    .expect(getLocation()).contains('/solution/S100000-001');
});

test('should render the About your solution section group', async (t) => {
  await pageSetup(t);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');

  await t
    .expect(aboutYourSolutionSectionGroup.find('h2').innerText).eql('About your Solution');
});

test('should render the Client application type section group', async (t) => {
  await pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');

  await t
    .expect(clientApplicationTypeSectionGroup.find('h2').innerText).eql('Client application type');
});

test('should render the About your Organisation section group', async (t) => {
  await pageSetup(t);

  const aboutYourOrganisationSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-organisation"]');

  await t
    .expect(aboutYourOrganisationSectionGroup.find('h2').innerText).eql('About your Organisation');
});

test('should render all the sections for the About your solution section group', async (t) => {
  await pageSetup(t);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');
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
  await pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');

  await t
    .expect(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Client application type')
    .expect(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});

test('should render all the sections for the About your organisation section group', async (t) => {
  await pageSetup(t);

  const aboutYourOrganisationSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-organisation"]');
  const contactDetailsSection = aboutYourOrganisationSectionGroup.find('[data-test-id="dashboard-section-contact-details"]');

  await t
    .expect(contactDetailsSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Contact details')
    .expect(contactDetailsSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(contactDetailsSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});

test('should render all the sub sections for the client application type section with the default message when no selection has been made', async (t) => {
  await pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');
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

test('should render all the sub sections for the client application type section with requirment and status when all 3 application types have been selected', async (t) => {
  await pageSetup(t, false);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');
  const clientApplicationTypeSection = clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-client-application-types"]');

  const browserBasedSubSection = clientApplicationTypeSection.find('[data-test-id="dashboard-sub-section-browser-based"]');
  const nativeMobileSubSection = clientApplicationTypeSection.find('[data-test-id="dashboard-sub-section-native-mobile"]');
  const nativeDesktopSubSection = clientApplicationTypeSection.find('[data-test-id="dashboard-sub-section-native-desktop"]');

  await t
    .expect(browserBasedSubSection.count).eql(1)
    .expect(browserBasedSubSection.find('a').exists).ok()
    .expect(browserBasedSubSection.find('[data-test-id="dashboard-section-title"]').innerText).eql('Browser based')
    .expect(browserBasedSubSection.find('[data-test-id="dashboard-section-default-message"]').exists).notOk()
    .expect(browserBasedSubSection.find('[data-test-id="dashboard-section-requirement"]').innerText).eql('Mandatory')
    .expect(browserBasedSubSection.find('[data-test-id="dashboard-section-status"]').innerText).eql('COMPLETE')

    .expect(nativeMobileSubSection.count).eql(1)
    .expect(nativeMobileSubSection.find('a').exists).ok()
    .expect(nativeMobileSubSection.find('[data-test-id="dashboard-section-title"]').innerText).eql('Native mobile or tablet')
    .expect(nativeMobileSubSection.find('[data-test-id="dashboard-section-default-message"]').exists).notOk()
    .expect(nativeMobileSubSection.find('[data-test-id="dashboard-section-requirement"]').innerText).eql('Mandatory')
    .expect(nativeMobileSubSection.find('[data-test-id="dashboard-section-status"]').innerText).eql('COMPLETE')

    .expect(nativeDesktopSubSection.count).eql(1)
    .expect(nativeDesktopSubSection.find('a').exists).ok()
    .expect(nativeDesktopSubSection.find('[data-test-id="dashboard-section-title"]').innerText).eql('Native desktop')
    .expect(nativeDesktopSubSection.find('[data-test-id="dashboard-section-default-message"]').exists).notOk()
    .expect(nativeDesktopSubSection.find('[data-test-id="dashboard-section-requirement"]').innerText).eql('Mandatory')
    .expect(nativeDesktopSubSection.find('[data-test-id="dashboard-section-status"]').innerText).eql('COMPLETE');
});

test('clicking on the solution description section link should navigate the user to the solution description page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/solution-description`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');
  const theSolutionDescriptionSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-solution-description"]');

  await t
    .click(theSolutionDescriptionSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/solution-description');
});


test('clicking on the feature section link should navigate the user to the features page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/features`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');
  const theFeatureSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-features"]');

  await t
    .click(theFeatureSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/features');
});

test('clicking on the client application type section link should navigate the user to the client application type page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/client-application-types`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');
  const theClientApplicationTypeSection = clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-client-application-types"]');

  await t
    .click(theClientApplicationTypeSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/client-application-type');
});

test('clicking on the contact details section link should navigate the user to contact details page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/contact-details`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const aboutYourOrganisationSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-organisation"]');
  const contactDetailsSection = aboutYourOrganisationSectionGroup.find('[data-test-id="dashboard-section-contact-details"]');

  await t
    .click(contactDetailsSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/contact-details');
});

test('should render the Error summary containing all the sections that failed the SubmitForReview', async (t) => {
  await pageSetup(t);

  const submitForReviewError = {
    required: ['solution-description', 'client-application-types'],
  };

  nock(apiLocalhost)
    .put(`${apiPath}/SubmitForReview`)
    .reply(400, submitForReviewError);

  nock(apiLocalhost)
    .get(`${apiPath}/dashboard`)
    .reply(200, dashboardWithIncompleteSections);

  const getLocation = ClientFunction(() => document.location.href);

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const solutionDescriptionError = errorSummary.find('li:nth-child(1)');
  const clientApplicationTypeError = errorSummary.find('li:nth-child(2)');
  const submitForModerationButton = Selector('[data-test-id="dashboard-submit-for-moderation-button"] a');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitForModerationButton)

    .expect(errorSummary.exists).ok()

    .expect(solutionDescriptionError.innerText).eql('Solution description is a mandatory section')
    .click(solutionDescriptionError.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/submitForModeration#solution-description')

    .expect(clientApplicationTypeError.innerText).eql('Client application type is a mandatory section')
    .click(clientApplicationTypeError.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/submitForModeration#client-application-types');
});
