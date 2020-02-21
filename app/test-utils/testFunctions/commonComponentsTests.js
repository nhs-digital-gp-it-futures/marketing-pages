import { Selector, ClientFunction } from 'testcafe';
import nock from 'nock';
import dashboardWithCompleteSections from '../../../fixtures/dashboardWithCompleteSections.json';
import authorityDashboardWithCompleteSections from '../../pages/authority/fixtures/dashboardWithCompleteSections.json';
import { apiLocalhost, apiPath } from '../config';
import { extractInnerText } from '../helper';

const getLocation = ClientFunction(() => document.location.href);

const titleTest = async ({ pageSetup, sectionManifest }) => {
  if (sectionManifest.title) {
    await test('should render the page title', async (t) => {
      await pageSetup({ t });
      const title = Selector('[data-test-id="section-title"]');
      await t
        .expect(await extractInnerText(title)).eql(sectionManifest.title);
    });
  }
};

const mainAdviceTest = async ({ pageSetup, sectionManifest }) => {
  if (sectionManifest.mainAdvice) {
    await test('should render main advice of section', async (t) => {
      await pageSetup({ t });
      const mainAdvice = Selector('[data-test-id="section-main-advice"]');
      await t
        .expect(await extractInnerText(mainAdvice)).eql(sectionManifest.mainAdvice);
    });
  }
};

const allAdviceTest = async ({ pageSetup, sectionManifest }) => {
  if (sectionManifest.additionalAdvice) {
    await test('should render all the advice of the section', async (t) => {
      await pageSetup({ t });
      const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');
      const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');
      await t
        .expect(await extractInnerText(additionalAdvice)).eql(expectedAdditionalAdvice);
    });
  }
};

const submitButtonTest = async ({ pageSetup, sectionManifest }) => {
  await test('should render the submit button', async (t) => {
    await pageSetup({ t });
    const submitButton = Selector('[data-test-id="section-submit-button"]');

    await t
      .expect(submitButton.find('button').count).eql(1)
      .expect(await extractInnerText(submitButton)).eql(sectionManifest.submitText);
  });
};

const submitButtonClickedTest = async ({
  pageSetup,
  sectionId,
  data,
  sectionManifest,
  dashboardId,
}) => {
  if (sectionManifest.successfulSubmitResponsePath) {
    await test(`should go to ${sectionManifest.successfulSubmitResponsePath} when clicking the submit button`, async (t) => {
      await pageSetup({ t, responseBody: data });
      await nock(apiLocalhost)
        .put(`${apiPath}/sections/${sectionId}`, data)
        .reply(200, data);
      await nock(apiLocalhost)
        .get(`${apiPath}/dashboards/${dashboardId}`)
        .reply(200, {});

      const submitButton = Selector('[data-test-id="section-submit-button"] button');

      await t
        .expect(submitButton.exists).ok()
        .click(submitButton)
        .expect(getLocation()).contains(`/solution/S100000-001/${sectionManifest.successfulSubmitResponsePath}`)
        .expect(getLocation()).notContains(`/${sectionId}`);
    });
  }
};

const sectionsLinkTest = async ({ pageSetup }) => {
  await test('should render the return to all sections link', async (t) => {
    await pageSetup({ t });
    const link = Selector('[data-test-id="section-back-link"] a');

    await t
      .expect(await extractInnerText(link)).eql('Return to adding a Solution');
  });
};

const sectionsLinkClickedTest = async ({ pageSetup, userContextType }) => {
  await test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
    await pageSetup({ t });

    const isSupplier = userContextType === 'supplier';
    const dashboardEndpoint = isSupplier ? `${apiPath}/dashboard` : `${apiPath}/dashboard/authority`;
    const dasboardData = isSupplier ? dashboardWithCompleteSections : authorityDashboardWithCompleteSections;

    await nock(apiLocalhost)
      .get(dashboardEndpoint)
      .reply(200, dasboardData);

    const link = Selector('[data-test-id="section-back-link"] a');

    await t
      .click(link)
      .expect(getLocation()).notContains('section')
      .expect(getLocation()).contains('/solution/S100000-001');
  });
};

export const runCommonComponentsTests = async ({
  pageSetup,
  sectionManifest,
  sectionId,
  data,
  dashboardId,
  userContextType,
}) => {
  await Promise.all([
    titleTest({ pageSetup, sectionManifest }),
    mainAdviceTest({ pageSetup, sectionManifest }),
    allAdviceTest({ pageSetup, sectionManifest }),
    submitButtonTest({ pageSetup, sectionManifest }),
    submitButtonClickedTest({
      pageSetup,
      sectionId,
      data,
      sectionManifest,
      dashboardId,
    }),
    sectionsLinkTest({ pageSetup }),
    sectionsLinkClickedTest({ pageSetup, userContextType }),
  ]);
};
