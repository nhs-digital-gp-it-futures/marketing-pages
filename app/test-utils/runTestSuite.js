import nock from 'nock';
import { ManifestProvider } from '../manifestProvider';
import { runCommonComponentsTests } from './testFunctions/commonComponentsTests';
import { runQuestionTests } from './testFunctions/questionTests';

const apiLocalhost = 'http://localhost:8080';

export const runTestSuite = async ({
  data,
  sectionId,
  dashboardId,
}) => {
  const clientUrl = dashboardId ? `http://localhost:1234/solution/S100000-001/dashboard/${dashboardId}/section/${sectionId}`
    : `http://localhost:1234/solution/S100000-001/section/${sectionId}`;

  const mocks = (responseStatus, responseBody) => {
    nock(apiLocalhost)
      .get(`/api/v1/Solutions/S100000-001/sections/${sectionId}`)
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
    apiLocalhost,
  });

  runQuestionTests({
    pageSetup,
    sectionManifest,
    data,
    sectionId,
    apiLocalhost,
    dashboardId,
  });
};
