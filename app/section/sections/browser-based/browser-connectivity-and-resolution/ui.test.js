import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browser-connectivity-and-resolution';
const dashboardId = 'browser-based';

const connectivityAndResolutionMarketingData = {
  'minimum-connection-speed': '1Mbps',
  'minimum-desktop-resolution': '16:9 - 2048 x 1152',
};

runTestSuite({
  data: connectivityAndResolutionMarketingData,
  sectionId,
  dashboardId,
});
