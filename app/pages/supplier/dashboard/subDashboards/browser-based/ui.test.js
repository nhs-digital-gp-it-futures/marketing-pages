import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../../../fixtures/dashboardWithCompleteSections.json';
import browserBasedFixture from './fixtureData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../../../test-utils/config';
import { extractInnerText } from '../../../../../test-utils/helper';

const mocks = () => {
  nock(apiLocalhost)
    .get(`${apiPath}/dashboards/browser-based`)
    .reply(200, browserBasedFixture);
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo(`${clientLocalhost}/supplier/solution/S100000-001/dashboard/browser-based`);
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Show browser based dashboard page');

test('should render the browser based dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="sub-dashboard-title"]');

  await t
    .expect(await extractInnerText(title)).eql('Browser based');
});

test('should render the browser based dashboard main advice', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="sub-dashboard-main-advice"]');

  await t
    .expect(await extractInnerText(mainAdvice)).eql('Add further detail about your browser based application.');
});

test('should render the Browser based section group', async (t) => {
  await pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');

  await t
    .expect(await extractInnerText(browserBasedSectionGroup.find('h2'))).eql('Browser based sections');
});

test('should render all the sections for the Browser based sections section group', async (t) => {
  await pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const browsersSupportedSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-browsers-supported"]');
  const mobileFirstSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-mobile-first"]');
  const pluginsOrExtensionsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-plug-ins-or-extensions"]');
  const connectivityAndResolutionSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-connectivity-and-resolution"]');
  const hardwareRequirementsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-hardware-requirements"]');
  const additionalInformationSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-additional-information"]');

  await t
    .expect(await extractInnerText(browsersSupportedSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Browsers supported')
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-browsers-supported')
    .expect(await extractInnerText(browsersSupportedSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(browsersSupportedSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(mobileFirstSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Mobile first')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-mobile-first')
    .expect(await extractInnerText(mobileFirstSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(mobileFirstSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Plug-ins or extensions')
    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-plug-ins-or-extensions')
    .expect(await extractInnerText(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Connectivity and resolution')
    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-connectivity-and-resolution')
    .expect(await extractInnerText(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(hardwareRequirementsSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Hardware requirements')
    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-hardware-requirements')
    .expect(await extractInnerText(hardwareRequirementsSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(hardwareRequirementsSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(additionalInformationSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Additional information')
    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-additional-information')
    .expect(await extractInnerText(additionalInformationSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(additionalInformationSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});

test('should navigate the user to the browsers supported page when clicking on the browsers supported dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/browser-browsers-supported`)
    .reply(200, {});

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const browsersSupportedSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-browsers-supported"]');

  await t
    .click(browsersSupportedSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-browsers-supported');
});

test('should navigate the user to the mobile first page when clicking on the mobile first dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/browser-mobile-first`)
    .reply(200, {});

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const mobileFirstSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-mobile-first"]');

  await t
    .click(mobileFirstSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-mobile-first');
});

test('should navigate the user to the plug-ins or extensions page when clicking on the plug-ins or extensions dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/browser-plug-ins-or-extensions`)
    .reply(200, {});

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const pluginsOrExtensionsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-plug-ins-or-extensions"]');

  await t
    .click(pluginsOrExtensionsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-plug-ins-or-extensions');
});

test('should navigate the user to the connectivity and resolution page when clicking on the connectivity and resolution dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/browser-connectivity-and-resolution`)
    .reply(200, {});

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const connectivityAndResolutionSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-connectivity-and-resolution"]');

  await t
    .click(connectivityAndResolutionSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-connectivity-and-resolution');
});

test('should navigate the user to the hardware requirements page when clicking on the hardware requirements dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/browser-hardware-requirements`)
    .reply(200, {});

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const hardwareRequirementsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-hardware-requirements"]');

  await t
    .click(hardwareRequirementsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-hardware-requirements');
});

test('should navigate the user to the additional information page when clicking on the additional information dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/browser-additional-information`)
    .reply(200, {});

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const additionalInformationSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-additional-information"]');

  await t
    .click(additionalInformationSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/browser-based/section/browser-additional-information');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] a');

  await t
    .expect(await extractInnerText(link)).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/dashboard`)
    .reply(200, dashboardWithCompleteSections);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] a');

  await t
    .click(link)
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('S100000-001');
});
