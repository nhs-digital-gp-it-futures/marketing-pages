import nock from 'nock';
import { ManifestProvider } from '../manifestProvider';
import { runGeneralSectionTests } from './testFunctions/commonSectionTests';
import { runQuestionTests } from './testFunctions/questionTests';

const apiLocalhost = 'http://localhost:8080';

export const runTestSuite = async ({
  data,
  sectionApiUrl,
  sectionId,
  fieldLengthMap = {},
  clientUrl,
  parentSectionApiUrl,
}) => {
  const mocks = (responseStatus, responseBody) => {
    nock(apiLocalhost)
      .get(sectionApiUrl)
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

  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  fixture(`Show ${sectionManifest.title} page`)
    .afterEach(async (t) => {
      const isDone = nock.isDone();
      if (!isDone) {
        nock.cleanAll();
      }
      await t.expect(isDone).ok('Not all nock interceptors were used!');
    });

  runGeneralSectionTests({
    pageSetup,
    sectionManifest,
    sectionApiUrl,
    data,
    parentSectionApiUrl,
    apiLocalhost,
  });

  runQuestionTests({
    pageSetup,
    sectionManifest,
    sectionApiUrl,
    data,
    fieldLengthMap,
    sectionId,
    apiLocalhost,
  });
};
