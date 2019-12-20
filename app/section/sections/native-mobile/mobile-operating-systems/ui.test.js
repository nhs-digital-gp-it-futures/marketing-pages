import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-operating-systems';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/native-mobile/section/${sectionId}`;
const dashboardId = 'native-mobile';

const mobileOperatingSystemsMarketingData = {
  'operating-systems': ['apple-ios', 'android', 'other'],
  'operating-systems-description': 'Text for description',
};

runTestSuite({
  data: mobileOperatingSystemsMarketingData,
  sectionId,
  clientUrl,
  dashboardId,
});
