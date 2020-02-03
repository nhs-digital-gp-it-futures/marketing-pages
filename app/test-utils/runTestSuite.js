import nock from 'nock';
import { ManifestProvider } from '../manifestProvider';
import { runCommonComponentsTests } from './testFunctions/commonComponentsTests';
import { runQuestionTests } from './testFunctions/questionTests';
import { apiLocalhost, apiPath, clientLocalhost } from './config';

export const runTestSuite = async ({
  data,
  sectionId,
  dashboardId,
  errorPostBodyData,
}) => {
  const clientUrl = dashboardId ? `${clientLocalhost}/supplier/solution/S100000-001/dashboard/${dashboardId}/section/${sectionId}`
    : `${clientLocalhost}/supplier/solution/S100000-001/section/${sectionId}`;

  const mocks = async (responseStatus, responseBody) => {
    await nock(apiLocalhost)
      .get(`${apiPath}/sections/${sectionId}`)
      .reply(responseStatus, responseBody);
  };

  const pageSetup = async ({
    t,
    responseStatus = 200,
    responseBody = {},
  }) => {
    await mocks(responseStatus, responseBody);
    await t.navigateTo(clientUrl);
  };

  const sectionManifest = new ManifestProvider().getSectionManifest({ sectionId, dashboardId });

  fixture(`Show ${sectionManifest.title} page`);

  await Promise.all([
    runCommonComponentsTests({
      pageSetup,
      sectionManifest,
      sectionId,
      data,
      dashboardId,
    }),
    runQuestionTests({
      pageSetup,
      sectionManifest,
      data,
      sectionId,
      dashboardId,
      errorPostBodyData,
    }),
  ]);
};
