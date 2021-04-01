import nock from 'nock';
import { extractInnerText } from 'buying-catalogue-library';
import { Selector } from 'testcafe';
import previewWithNoMarketingData from '../../../../fixtures/previewWithNoMarketingData.json';
import previewWithMarketingData from '../../../../fixtures/previewWithMarketingData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../test-utils/config';

const mocks = (existingData) => {
  if (!existingData) {
    nock(apiLocalhost)
      .get(`${apiPath}/preview`)
      .reply(200, previewWithNoMarketingData);
  } else {
    nock(apiLocalhost)
      .get(`${apiPath}/preview`)
      .reply(200, previewWithMarketingData);
  }
};

const pageSetup = async (t, existingData = false) => {
  mocks(existingData);
  await t.navigateTo(`${clientLocalhost}/supplier/solution/S100000-001/preview`);
};

fixture('Show marketing preview page - heading components');

const defaultHeaderSections = {
  'should render the marketing preview page back link': '[data-test-id="view-solution-page-back-link"]',
  'should render the marketing preview page foundation tag': '[data-test-id="view-solution-foundation"]',
  'should render the marketing preview page solution name': '[data-test-id="view-solution-page-solution-name"]',
  'should render the marketing preview page supplier name': '[data-test-id="view-solution-page-supplier-name"]',
  'should render the marketing preview page solution id': '[data-test-id="view-solution-page-solution-id"]',
  'should render the marketing preview page last updated date': '[data-test-id="view-solution-page-last-updated"]',
};

Object.keys(defaultHeaderSections).forEach((key) => {
  test(key, async (t) => {
    await pageSetup(t);
    const element = Selector(defaultHeaderSections[key]);
    await t
      .expect(element.exists).ok();
  });
});

fixture('Show marketing preview page - no existing marketing data');

const nonDefaultSections = {
  'Solution description section should not be rendered': '[data-test-id="view-solution-description"]',
  'Features section should not be rendered': '[data-test-id="view-features"]',
  'Capabilities section should not be rendered': '[data-test-id="view-capabilities"]',
  'Integrations section should not be rendered': '[data-test-id="view-integrations"]',
  'Implementation timescales section should not be rendered': '[data-test-id="view-implementation-timescales"]',
  'Client-application-types section should not be rendered': '[data-test-id="view-client-application-types"]',
  'Hosting type - public cloud section should not be rendered': '[data-test-id="view-hosting-types"]',
  'Hosting type - private cloud section should not be rendered': '[data-test-id="view-hosting-types"]',
  'Hosting type - hybrid section should not be rendered': '[data-test-id="view-hosting-types"]',
  'Hosting type - on premise section should not be rendered': '[data-test-id="view-hosting-types"]',
  'About supplier section should not be rendered': '[data-test-id="view-about-supplier"]',
  'Contact-details section should not be rendered': '[data-test-id="view-solution-contact-details"]',
  'Roadmap section should not be rendered': '[data-test-id="view-roadmap"]',
  'Learn More section should not be rendered': '[data-test-id="view-learn-more"]',
};

Object.keys(nonDefaultSections).forEach((key) => {
  test(key, async (t) => {
    await pageSetup(t);
    const element = Selector(nonDefaultSections[key]);
    await t
      .expect(element.exists).notOk();
  });
});

fixture('Show marketing preview page - with existing marketing data');

test('Capabilities section should be rendered and the capabilities displayed', async (t) => {
  await pageSetup(t, true);

  const capabilitiesSection = Selector('[data-test-id="view-capabilities"]');
  const capabilitiesExpandableSection = Selector('[data-test-id="view-section-capabilities"]');
  const epicsSection = capabilitiesSection.find('[data-test-id="view-question-epic"]');
  const mustEpics = epicsSection.find('[data-test-id="must-epics"]');
  const mayEpics = epicsSection.find('[data-test-id="may-epics"]');

  await t
    .expect(capabilitiesSection.exists)
    .ok()
    .expect(capabilitiesExpandableSection.find('details[open]').exists)
    .notOk()
    .click(capabilitiesExpandableSection.find('summary'))
    .expect(capabilitiesExpandableSection.find('details[open]').exists)
    .ok()

    .expect(epicsSection.exists)
    .ok()
    .expect(mustEpics.exists)
    .ok()
    .expect(mayEpics.exists)
    .ok();
});

test('Client application type - browser-based section should be rendered', async (t) => {
  await pageSetup(t, true);
  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const browserBasedExpandableSection = Selector('[data-test-id="view-section-browser-based"]');

  await t
    .expect(clientApplicationTypesSection.exists)
    .ok()

    .expect(browserBasedExpandableSection.exists)
    .ok()
    .expect(browserBasedExpandableSection.find('details[open]').exists)
    .notOk()
    .click(browserBasedExpandableSection.find('summary'))
    .expect(browserBasedExpandableSection.find('details[open]').exists)
    .ok();
});

test('Client application type - native-mobile section should be rendered', async (t) => {
  await pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeMobileExpandableSection = Selector('[data-test-id="view-section-native-mobile"]');

  await t
    .expect(clientApplicationTypesSection.exists)
    .ok()

    .expect(nativeMobileExpandableSection.exists)
    .ok()
    .expect(nativeMobileExpandableSection.find('details[open]').exists)
    .notOk()
    .click(nativeMobileExpandableSection.find('summary'))
    .expect(nativeMobileExpandableSection.find('details[open]').exists)
    .ok();
});

test('Client application type - native-desktop section should be rendered', async (t) => {
  await pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeDesktopExpandableSection = Selector('[data-test-id="view-section-native-desktop"]');

  await t
    .expect(clientApplicationTypesSection.exists)
    .ok()

    .expect(nativeDesktopExpandableSection.exists)
    .ok()
    .expect(await extractInnerText(nativeDesktopExpandableSection))
    .eql('Native desktop application')
    .expect(nativeDesktopExpandableSection.find('details[open]').exists)
    .notOk()
    .click(nativeDesktopExpandableSection.find('summary'))
    .expect(nativeDesktopExpandableSection.find('details[open]').exists)
    .ok();
});

test('Hosting type - public cloud section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypePublicCloudExpandableSection = Selector('[data-test-id="view-section-hosting-type-public-cloud"]');

  await t
    .expect(hostingTypesSection.exists)
    .ok()

    .expect(hostingTypePublicCloudExpandableSection.exists)
    .ok()
    .expect(hostingTypePublicCloudExpandableSection.find('details[open]').exists)
    .notOk()
    .click(hostingTypePublicCloudExpandableSection.find('summary'))
    .expect(hostingTypePublicCloudExpandableSection.find('details[open]').exists)
    .ok();
});

test('Hosting type - private cloud section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypePrivateCloudExpandableSection = Selector('[data-test-id="view-section-hosting-type-private-cloud"]');

  await t
    .expect(hostingTypesSection.exists)
    .ok()

    .expect(hostingTypePrivateCloudExpandableSection.exists)
    .ok()
    .expect(hostingTypePrivateCloudExpandableSection.find('details[open]').exists)
    .notOk()
    .click(hostingTypePrivateCloudExpandableSection.find('summary'))
    .expect(hostingTypePrivateCloudExpandableSection.find('details[open]').exists)
    .ok();
});

test('Hosting type - hybrid section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypeHybridExpandableSection = Selector('[data-test-id="view-section-hosting-type-hybrid"]');

  await t
    .expect(hostingTypesSection.exists)
    .ok()

    .expect(hostingTypeHybridExpandableSection.exists)
    .ok()
    .expect(hostingTypeHybridExpandableSection.find('details[open]').exists)
    .notOk()
    .click(hostingTypeHybridExpandableSection.find('summary'))
    .expect(hostingTypeHybridExpandableSection.find('details[open]').exists)
    .ok();
});

test('Hosting type - on premise section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypeOnPremiseExpandableSection = Selector('[data-test-id="view-section-hosting-type-on-premise"]');

  await t
    .expect(hostingTypesSection.exists)
    .ok()

    .expect(hostingTypeOnPremiseExpandableSection.exists)
    .ok()
    .expect(hostingTypeOnPremiseExpandableSection.find('details[open]').exists)
    .notOk()
    .click(hostingTypeOnPremiseExpandableSection.find('summary'))
    .expect(hostingTypeOnPremiseExpandableSection.find('details[open]').exists)
    .ok();
});

test('About supplier section and all questions should be rendered', async (t) => {
  await pageSetup(t, true);

  const aboutSupplierSection = Selector('[data-test-id="view-about-supplier"]');
  const descriptionQuestion = aboutSupplierSection.find('[data-test-id="view-section-question-description"]');
  const linkQuestion = aboutSupplierSection.find('[data-test-id="view-section-question-link"]');

  await t
    .expect(aboutSupplierSection.exists)
    .ok()

    .expect(descriptionQuestion.exists)
    .ok()
    .expect(descriptionQuestion.find('[data-test-id="view-question-title"]').exists)
    .notOk()

    .expect(linkQuestion.exists)
    .ok()
    .expect(linkQuestion.find('[data-test-id="view-question-title"]').exists)
    .notOk();
});

const defaultSectionsWithData = {
  'Solution description should be rendered': '[data-test-id="view-solution-description"]',
  'Solution summary question should be rendered': '[data-test-id="view-section-table-row-summary"]',
  'Solution description question should be rendered': '[data-test-id="view-section-table-row-description"]',
  'Features section should be rendered': '[data-test-id="view-features"]',
  'Features section bullet list should be rendered': '[data-test-id="view-question-data-bulletlist"]',
  'Integrations section should be rendered': '[data-test-id="view-integrations"]',
  'Implementation timescales section should be rendered': '[data-test-id="view-implementation-timescales"]',
  'Contact-details section should be rendered': '[data-test-id="view-solution-contact-details"]',
  'Roadmap section should be rendered': '[data-test-id="view-roadmap"]',
  'Learn More section should be rendered': '[data-test-id="view-learn-more"]',
};

Object.keys(defaultSectionsWithData).forEach((key) => {
  test(key, async (t) => {
    await pageSetup(t, true);
    const element = Selector(defaultSectionsWithData[key]);
    await t
      .expect(element.exists).ok();
  });
});
