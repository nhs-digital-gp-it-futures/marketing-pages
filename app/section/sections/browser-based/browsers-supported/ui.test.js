import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browsers-supported';
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
  dashboardId,
});
