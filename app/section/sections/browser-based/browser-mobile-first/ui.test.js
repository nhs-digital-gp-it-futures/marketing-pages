import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browser-mobile-first';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const dashboardId = 'browser-based';

const browserMobileFirstMarketingData = {
  'mobile-first-design': 'Yes',
};

runTestSuite({
  data: browserMobileFirstMarketingData,
  sectionId,
  clientUrl,
  dashboardId,
});
