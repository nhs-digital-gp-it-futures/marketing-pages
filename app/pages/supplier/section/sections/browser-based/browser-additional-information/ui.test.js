import { runTestSuite } from '../../../../../../test-utils/runTestSuite';

const sectionId = 'browser-additional-information';
const dashboardId = 'browser-based';

const additionalInformationData = {
  'additional-information': 'The solution additional information',
};

runTestSuite({
  data: additionalInformationData,
  sectionId,
  dashboardId,
});
