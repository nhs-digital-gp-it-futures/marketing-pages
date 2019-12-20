import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'connectivity-and-resolution';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const dashboardId = 'browser-based';

const connectivityAndResolutionMarketingData = {
  'minimum-connection-speed': '1Mbps',
  'minimum-desktop-resolution': '16:9 - 2048 x 1152',
};

runTestSuite({
  data: connectivityAndResolutionMarketingData,
  sectionId,
  clientUrl,
  dashboardId,
});
