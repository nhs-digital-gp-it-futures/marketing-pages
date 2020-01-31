import { runTestSuite } from '../../../../../../test-utils/runTestSuite';

const sectionId = 'browser-mobile-first';
const dashboardId = 'browser-based';

const browserMobileFirstMarketingData = {
  'mobile-first-design': 'Yes',
};

runTestSuite({
  data: browserMobileFirstMarketingData,
  sectionId,
  dashboardId,
});
