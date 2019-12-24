import nock from 'nock';
import { ManifestProvider } from '../manifestProvider';
import { runCommonComponentsTests } from './testFunctions/commonComponentsTests';
import { runQuestionTests } from './testFunctions/questionTests';
import { apiLocalhost, apiPath, clientLocalhost } from './config';

export const runTestSuite = async ({
  data,
  sectionId,
  dashboardId,
}) => {
  const clientUrl = dashboardId ? `${clientLocalhost}/dashboard/${dashboardId}/section/${sectionId}`
    : `${clientLocalhost}/section/${sectionId}`;

  const mocks = (responseStatus, responseBody) => {
    nock(apiLocalhost)
      .get(`${apiPath}/sections/${sectionId}`)
      .reply(responseStatus, responseBody);
  };

  const pageSetup = async ({
    t,
    responseStatus = 200,
    responseBody = {},
  }) => {
    mocks(responseStatus, responseBody);
    await t.navigateTo(clientUrl);
  };

  const sectionManifest = new ManifestProvider().getSectionManifest({ sectionId, dashboardId });

  fixture(`Show ${sectionManifest.title} page`)
    .afterEach(async (t) => {
      const isDone = nock.isDone();
      if (!isDone) {
        nock.cleanAll();
      }
      await t.expect(isDone).ok('Not all nock interceptors were used!');
    });

  runCommonComponentsTests({
    pageSetup,
    sectionManifest,
    sectionId,
    data,
    dashboardId,
  });

  runQuestionTests({
    pageSetup,
    sectionManifest,
    data,
    sectionId,
    dashboardId,
  });
};
