import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithIncompleteSections from '../fixtures/dashboardWithIncompleteSections.json';
import dashboardWithCompleteSections from '../fixtures/dashboardWithCompleteSections.json';
import previewWithMarketingData from '../../../../fixtures/previewWithMarketingData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../test-utils/config';
import { extractInnerText } from '../../../test-utils/helper';

const mocks = (initalDashboard) => {
  if (initalDashboard) {
    nock(apiLocalhost)
      .get(`${apiPath}/dashboard/authority`)
      .reply(200, dashboardWithIncompleteSections);
  } else {
    nock(apiLocalhost)
      .get(`${apiPath}/dashboard/authority`)
      .reply(200, dashboardWithCompleteSections);
  }
};

const pageSetup = async (t, initalDashboard = true) => {
  mocks(initalDashboard);
  await t.navigateTo(`${clientLocalhost}/authority/solution/S100000-001`);
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Show marketing authority dashboard page');

test('should render the marketing authority dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(await extractInnerText(title)).eql('Marketing Page - Authority - Dashboard');
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

test('should render the Capabilities section group', async (t) => {
  await pageSetup(t);

  const capabilitiesSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-capabilities"]');

  await t
    .expect(await extractInnerText(capabilitiesSectionGroup.find('h2'))).eql('Solution Capabilities');
});


test('should render all the sections for the Capabilities section group', async (t) => {
  await pageSetup(t);

  const capabilitiesSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-capabilities"]');
  const capabilitiesSection = capabilitiesSectionGroup.find('[data-test-id="dashboard-section-capabilities"]');
  const epicsSection = capabilitiesSectionGroup.find('[data-test-id="dashboard-section-epics"]');

  await t
    .expect(await extractInnerText(capabilitiesSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Capabilities')
    .expect(await extractInnerText(capabilitiesSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(capabilitiesSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')
    .expect(await extractInnerText(epicsSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Epics')
    .expect(await extractInnerText(epicsSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(epicsSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});

test('clicking on the capability section link should navigate the user to the capabilities page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/capabilities`)
    .reply(200, {});

  const capabilitiesSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-capabilities"]');
  const capabilitiesSection = capabilitiesSectionGroup.find('[data-test-id="dashboard-section-capabilities"]');

  await t
    .click(capabilitiesSection.find('a'))
    .expect(getLocation()).contains('/authority/solution/S100000-001/section/capabilities');
});

test.skip('clicking on the epics section link should navigate the user to the epics page', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/epics`)
    .reply(200, {});

  const capabilitiesSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-capabilities"]');
  const epicsSection = capabilitiesSectionGroup.find('[data-test-id="dashboard-section-epics"]');

  await t
    .click(epicsSection.find('a'))
    .expect(getLocation()).contains('/authority/solution/S100000-001/section/epics');
});
