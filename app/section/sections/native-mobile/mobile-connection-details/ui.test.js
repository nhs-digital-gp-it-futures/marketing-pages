import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-connection-details';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/native-mobile/section/${sectionId}`;
const dashboardId = 'native-mobile';

const mobileConnectionData = {
  'minimum-connection-speed': '3Mbps',
  'connection-types': ['3G'],
  'connection-requirements-description': 'Text',
};

runTestSuite({
  data: mobileConnectionData,
  sectionId,
  clientUrl,
  dashboardId,
});
