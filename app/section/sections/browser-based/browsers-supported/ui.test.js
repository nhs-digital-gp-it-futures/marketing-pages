import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browsers-supported';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const dashboardId = 'browser-based';

const browserSupportedMarketingData = {
  'supported-browsers': [
    'Google Chrome',
    'Internet Explorer 10',
  ],
  'mobile-responsive': 'Yes',
};

runTestSuite({
  data: browserSupportedMarketingData,
  sectionId,
  clientUrl,
  dashboardId,
});
