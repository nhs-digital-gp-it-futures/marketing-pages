import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-first';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/native-mobile/section/${sectionId}`;
const dashboardId = 'native-mobile';

const mobileFirstMarketingData = {
  'mobile-first-design': 'Yes',
};

runTestSuite({
  data: mobileFirstMarketingData,
  sectionId,
  clientUrl,
  dashboardId,
});
