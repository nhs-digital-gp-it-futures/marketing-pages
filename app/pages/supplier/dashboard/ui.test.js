import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithIncompleteSections from '../../../../fixtures/dashboardWithIncompleteSections.json';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';
import previewWithMarketingData from '../../../../fixtures/previewWithMarketingData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../test-utils/config';
import { extractInnerText } from '../../../test-utils/helper';

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

const getLocation = ClientFunction(() => document.location.href);

fixture('Show marketing dashboard page');

test('should render the marketing dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(await extractInnerText(title)).eql('Marketing Page - Dashboard');
});

test('should render the preview page button', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/preview`)
    .reply(200, previewWithMarketingData);

  const previewButton = Selector('[data-test-id="dashboard-preview-button"] a');

  await t
    .expect(await extractInnerText(previewButton)).eql('Preview Marketing page')
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

  const submitForModerationButton = Selector('[data-test-id="dashboard-submit-for-moderation-button"] a');

  await t
    .expect(await extractInnerText(submitForModerationButton)).eql('Submit for moderation')
    .click(submitForModerationButton)
    .expect(getLocation()).contains('/supplier/solution/S100000-001');
});

test('should render the About your solution section group', async (t) => {
  await pageSetup(t);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');

  await t
    .expect(await extractInnerText(aboutYourSolutionSectionGroup.find('h2'))).eql('About your Solution');
});

test('should render the Client application type section group', async (t) => {
  await pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');

  await t
    .expect(await extractInnerText(clientApplicationTypeSectionGroup.find('h2'))).eql('Client application type');
});

test('should render the Hosting type section group', async (t) => {
  await pageSetup(t);

  const hostingTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-hosting-type"]');

  await t
    .expect(await extractInnerText(hostingTypeSectionGroup.find('h2'))).eql('Hosting type');
});

test('should render the Your Product roadmap section group', async (t) => {
  await pageSetup(t);

  const productRoadmapSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-product-roadmap"]');

  await t
    .expect(await extractInnerText(productRoadmapSectionGroup.find('h2'))).eql('Your product roadmap');
});

test('should render the About your Organisation section group', async (t) => {
  await pageSetup(t);

  const aboutYourOrganisationSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-organisation"]');

  await t
    .expect(await extractInnerText(aboutYourOrganisationSectionGroup.find('h2'))).eql('About your Organisation');
});


test('should render all the sections for the About your solution section group', async (t) => {
  await pageSetup(t);

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');
  const solutionDescriptionSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-solution-description"]');
  const featuresSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-features"]');

  await t
    .expect(await extractInnerText(solutionDescriptionSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Solution description')
    .expect(await extractInnerText(solutionDescriptionSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(solutionDescriptionSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(featuresSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Features')
    .expect(await extractInnerText(featuresSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(featuresSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});

test('should render all the sections for the Client application type section group', async (t) => {
  await pageSetup(t);

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');

  await t
    .expect(await extractInnerText(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-title"]')))
    .eql('Client application type')
    .expect(await extractInnerText(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-status"]')))
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
    .expect(await extractInnerText(browserBasedSubSection.find('[data-test-id="dashboard-section-title"]'))).eql('Browser based')
    .expect(await extractInnerText(browserBasedSubSection.find('[data-test-id="dashboard-section-default-message"]'))).eql('Select from client application types')

    .expect(nativeMobileSubSection.count).eql(1)
    .expect(nativeMobileSubSection.find('a').exists).notOk()
    .expect(await extractInnerText(nativeMobileSubSection.find('[data-test-id="dashboard-section-title"]'))).eql('Native mobile or tablet')
    .expect(await extractInnerText(nativeMobileSubSection.find('[data-test-id="dashboard-section-default-message"]'))).eql('Select from client application types')

    .expect(nativeDesktopSubSection.count).eql(1)
    .expect(nativeDesktopSubSection.find('a').exists).notOk()
    .expect(await extractInnerText(nativeDesktopSubSection.find('[data-test-id="dashboard-section-title"]'))).eql('Native desktop')
    .expect(await extractInnerText(nativeDesktopSubSection.find('[data-test-id="dashboard-section-default-message"]'))).eql('Select from client application types');
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
    .expect(await extractInnerText(browserBasedSubSection.find('[data-test-id="dashboard-section-title"]'))).eql('Browser based')
    .expect(browserBasedSubSection.find('[data-test-id="dashboard-section-default-message"]').exists).notOk()
    .expect(await extractInnerText(browserBasedSubSection.find('[data-test-id="dashboard-section-requirement"]'))).eql('Mandatory')
    .expect(await extractInnerText(browserBasedSubSection.find('[data-test-id="dashboard-section-status"]'))).eql('COMPLETE')

    .expect(nativeMobileSubSection.count).eql(1)
    .expect(nativeMobileSubSection.find('a').exists).ok()
    .expect(await extractInnerText(nativeMobileSubSection.find('[data-test-id="dashboard-section-title"]'))).eql('Native mobile or tablet')
    .expect(nativeMobileSubSection.find('[data-test-id="dashboard-section-default-message"]').exists).notOk()
    .expect(await extractInnerText(nativeMobileSubSection.find('[data-test-id="dashboard-section-requirement"]'))).eql('Mandatory')
    .expect(await extractInnerText(nativeMobileSubSection.find('[data-test-id="dashboard-section-status"]'))).eql('COMPLETE')

    .expect(nativeDesktopSubSection.count).eql(1)
    .expect(nativeDesktopSubSection.find('a').exists).ok()
    .expect(await extractInnerText(nativeDesktopSubSection.find('[data-test-id="dashboard-section-title"]'))).eql('Native desktop')
    .expect(nativeDesktopSubSection.find('[data-test-id="dashboard-section-default-message"]').exists).notOk()
    .expect(await extractInnerText(nativeDesktopSubSection.find('[data-test-id="dashboard-section-requirement"]'))).eql('Mandatory')
    .expect(await extractInnerText(nativeDesktopSubSection.find('[data-test-id="dashboard-section-status"]'))).eql('COMPLETE');
});

test('should render all the sections for the Hosting type section group', async (t) => {
  await pageSetup(t);

  const hostingTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-hosting-type"]');
  const hostingTypePublicCloudSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-public-cloud"]');
  const hostingTypePrivateCloudSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-private-cloud"]');
  const hostingTypeHybridSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-hybrid"]');
  const hostingTypeOnPremiseSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-on-premise"]');

  await t
    .expect(await extractInnerText(hostingTypePublicCloudSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Public cloud')
    .expect(await extractInnerText(hostingTypePublicCloudSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(hostingTypePublicCloudSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(hostingTypePrivateCloudSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Private cloud')
    .expect(await extractInnerText(hostingTypePrivateCloudSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(hostingTypePrivateCloudSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(hostingTypeHybridSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Hybrid')
    .expect(await extractInnerText(hostingTypeHybridSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(hostingTypeHybridSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(hostingTypeOnPremiseSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('On premise')
    .expect(await extractInnerText(hostingTypeOnPremiseSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(hostingTypeOnPremiseSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});

test('should render all the sections for the Your product roadmap section group', async (t) => {
  await pageSetup(t);

  const productRoadmapSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-product-roadmap"]');
  const roadmapSection = productRoadmapSectionGroup.find('[data-test-id="dashboard-section-roadmap"]');

  await t
    .expect(await extractInnerText(roadmapSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Roadmap')
    .expect(await extractInnerText(roadmapSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(roadmapSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});

test('should render all the sections for the About your organisation section group', async (t) => {
  await pageSetup(t);

  const aboutYourOrganisationSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-organisation"]');
  const aboutSupplierSection = aboutYourOrganisationSectionGroup.find('[data-test-id="dashboard-section-about-supplier"]');
  const contactDetailsSection = aboutYourOrganisationSectionGroup.find('[data-test-id="dashboard-section-contact-details"]');

  await t
    .expect(await extractInnerText(aboutSupplierSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('About supplier')
    .expect(await extractInnerText(aboutSupplierSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(aboutSupplierSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(contactDetailsSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Contact details')
    .expect(await extractInnerText(contactDetailsSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(contactDetailsSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});


test('clicking on the solution description section link should navigate the user to the solution description page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/solution-description`)
    .reply(200, {});

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');
  const theSolutionDescriptionSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-solution-description"]');

  await t
    .click(theSolutionDescriptionSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/solution-description');
});

test('clicking on the feature section link should navigate the user to the features page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/features`)
    .reply(200, {});

  const aboutYourSolutionSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-solution"]');
  const theFeatureSection = aboutYourSolutionSectionGroup.find('[data-test-id="dashboard-section-features"]');

  await t
    .click(theFeatureSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/features');
});

test('clicking on the client application type section link should navigate the user to the client application type page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/client-application-types`)
    .reply(200, {});

  const clientApplicationTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-client-application-type"]');
  const theClientApplicationTypeSection = clientApplicationTypeSectionGroup.find('[data-test-id="dashboard-section-client-application-types"]');

  await t
    .click(theClientApplicationTypeSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/client-application-type');
});

test('clicking on the hosting type public cloud section link should navigate the user to the hosting type public cloud page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/hosting-type-public-cloud`)
    .reply(200, {});

  const hostingTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-hosting-type"]');
  const hostingTypePublicCloudSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-public-cloud"]');

  await t
    .click(hostingTypePublicCloudSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/hosting-type-public-cloud');
});

test('clicking on the hosting type private cloud section link should navigate the user to the hosting type private cloud page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/hosting-type-private-cloud`)
    .reply(200, {});

  const hostingTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-hosting-type"]');
  const hostingTypePrivateCloudSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-private-cloud"]');

  await t
    .click(hostingTypePrivateCloudSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/hosting-type-private-cloud');
});

test('clicking on the hosting type hybrid section link should navigate the user to the hosting type hybrid page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/hosting-type-hybrid`)
    .reply(200, {});

  const hostingTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-hosting-type"]');
  const hostingTypeHybridSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-hybrid"]');

  await t
    .click(hostingTypeHybridSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/hosting-type-hybrid');
});

test('clicking on the hosting type on premise section link should navigate the user to the hosting type on premise page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/hosting-type-on-premise`)
    .reply(200, {});

  const hostingTypeSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-hosting-type"]');
  const hostingTypeOnPremiseSection = hostingTypeSectionGroup.find('[data-test-id="dashboard-section-hosting-type-on-premise"]');

  await t
    .click(hostingTypeOnPremiseSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/hosting-type-on-premise');
});

test('clicking on the roadmap section link should navigate the user to roadmap page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/roadmap`)
    .reply(200, {});

  const productRoadmapSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-product-roadmap"]');
  const roadmapSection = productRoadmapSectionGroup.find('[data-test-id="dashboard-section-roadmap"]');

  await t
    .click(roadmapSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/roadmap');
});

test('clicking on the About supplier section link should navigate the user to About supplier page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/about-supplier`)
    .reply(200, {});

  const aboutYourOrganisationSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-organisation"]');
  const aboutSupplierSection = aboutYourOrganisationSectionGroup.find('[data-test-id="dashboard-section-about-supplier"]');

  await t
    .click(aboutSupplierSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/about-supplier');
});

test('clicking on the contact details section link should navigate the user to contact details page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/contact-details`)
    .reply(200, {});

  const aboutYourOrganisationSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-about-your-organisation"]');
  const contactDetailsSection = aboutYourOrganisationSectionGroup.find('[data-test-id="dashboard-section-contact-details"]');

  await t
    .click(contactDetailsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/section/contact-details');
});


test.only('should render the Error summary containing all the sections that failed the SubmitForReview', async (t) => {
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

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const submitForModerationButton = Selector('[data-test-id="dashboard-submit-for-moderation-button"] a');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitForModerationButton)
    .expect(errorSummary.exists).ok();

  const solutionDescriptionError = errorSummary.find('li:nth-child(1)');
  const clientApplicationTypeError = errorSummary.find('li:nth-child(2)');

  await t
    .expect(await extractInnerText(solutionDescriptionError)).eql('Solution description is a mandatory section')
    .click(solutionDescriptionError.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/submitForModeration#solution-description')

    .expect(await extractInnerText(clientApplicationTypeError)).eql('Client application type is a mandatory section')
    .click(clientApplicationTypeError.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/submitForModeration#client-application-types');
});
