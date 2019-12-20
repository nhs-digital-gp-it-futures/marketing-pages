
import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browser-additional-information';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const dashboardId = 'browser-based';

const additionalInformationData = {
  'additional-information': 'The solution additional information',
};

runTestSuite({
  data: additionalInformationData,
  sectionId,
  clientUrl,
  dashboardId,
});
