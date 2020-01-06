import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'native-desktop-connection-details';
const dashboardId = 'native-desktop';

const connectionDetailsMarketingData = {
  'minimum-connection-speed': '2Mbps',
};

runTestSuite({
  data: connectionDetailsMarketingData,
  sectionId,
  dashboardId,
});
