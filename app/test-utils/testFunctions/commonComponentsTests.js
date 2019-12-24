import { Selector, ClientFunction } from 'testcafe';
import nock from 'nock';
import dashboardWithCompleteSections from '../../../fixtures/dashboardWithCompleteSections.json';
import { apiLocalhost, apiPath } from '../config';

const getLocation = ClientFunction(() => document.location.href);

const titleTest = ({ pageSetup, sectionManifest }) => {
  if (sectionManifest.title) {
    test('should render the page title', async (t) => {
      await pageSetup({ t });
      const title = Selector('[data-test-id="section-title"]');
      await t
        .expect(title.innerText).eql(sectionManifest.title);
    });
  }
};

const mainAdviceTest = ({ pageSetup, sectionManifest }) => {
  if (sectionManifest.mainAdvice) {
    test('should render main advice of section', async (t) => {
      await pageSetup({ t });
      const mainAdvice = Selector('[data-test-id="section-main-advice"]');
      await t
        .expect(mainAdvice.innerText).eql(sectionManifest.mainAdvice);
    });
  }
};

const allAdviceTest = ({ pageSetup, sectionManifest }) => {
  if (sectionManifest.additionalAdvice) {
    test('should render all the advice of the section', async (t) => {
      await pageSetup({ t });
      const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');
      const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');
      await t
        .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
    });
  }
};

const submitButtonTest = ({ pageSetup, sectionManifest }) => {
  test('should render the submit button', async (t) => {
    await pageSetup({ t });
    const submitButton = Selector('[data-test-id="section-submit-button"]');
    await t
      .expect(submitButton.find('button').count).eql(1)
      .expect(submitButton.find('button').innerText).eql(sectionManifest.submitText);
  });
};

const submitButtonClickedTest = ({
  pageSetup,
  sectionId,
  data,
  sectionManifest,
  dashboardId,
}) => {
  if (sectionManifest.successfulSubmitResponsePath) {
    test(`should go to ${sectionManifest.successfulSubmitResponsePath} when clicking the submit button`, async (t) => {
      await pageSetup({ t, responseBody: data });
      nock(apiLocalhost)
        .put(`${apiPath}/sections/${sectionId}`)
        .reply(200, data);
      nock(apiLocalhost)
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

const sectionsLinkTest = ({ pageSetup }) => {
  test('should render the return to all sections link', async (t) => {
    await pageSetup({ t });
    const link = Selector('[data-test-id="section-back-link"] a');
    await t
      .expect(link.innerText).eql('Return to all sections');
  });
};

const sectionsLinkClickedTest = ({ pageSetup }) => {
  test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
    await pageSetup({ t });
    nock(apiLocalhost)
      .get('/api/v1/Solutions/S100000-001/dashboard')
      .reply(200, dashboardWithCompleteSections);
    const link = Selector('[data-test-id="section-back-link"] a');

    await t
      .click(link)
      .expect(getLocation()).notContains('section')
      .expect(getLocation()).contains('/solution/S100000-001');
  });
};

export const runCommonComponentsTests = ({
  pageSetup,
  sectionManifest,
  sectionId,
  data,
  dashboardId,
}) => {
  titleTest({ pageSetup, sectionManifest });
  mainAdviceTest({ pageSetup, sectionManifest });
  allAdviceTest({ pageSetup, sectionManifest });
  submitButtonTest({ pageSetup, sectionManifest });
  submitButtonClickedTest({
    pageSetup,
    sectionId,
    data,
    sectionManifest,
    dashboardId,
  });
  sectionsLinkTest({ pageSetup });
  sectionsLinkClickedTest({ pageSetup });
};
