import nock from 'nock';
import { getSectionManifest } from '../manifestProvider';
import { runCommonComponentsTests } from './testFunctions/commonComponentsTests';
import { runQuestionTests } from './testFunctions/questionTests';
import { apiLocalhost, apiPath, clientLocalhost } from './config';

export const runTestSuite = async ({
  data,
  sectionId,
  dashboardId,
  errorPostBodyData,
  userContextType = 'supplier',
}) => {
  const clientUrl = dashboardId ? `${clientLocalhost}/${userContextType}/solution/S100000-001/dashboard/${dashboardId}/section/${sectionId}`
    : `${clientLocalhost}/${userContextType}/solution/S100000-001/section/${sectionId}`;

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

  const sectionManifest = getSectionManifest({ sectionId, dashboardId, userContextType });

  fixture(`Show ${sectionManifest.title} page`);

  await Promise.all([
    runCommonComponentsTests({
      pageSetup,
      sectionManifest,
      sectionId,
      data,
      dashboardId,
      userContextType,
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
