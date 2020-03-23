import { runTestSuite } from '../../../../../../test-utils/runTestSuite';

const sectionId = 'native-mobile-connection-details';
const dashboardId = 'native-mobile';

const mobileConnectionData = {
  'minimum-connection-speed': '3Mbps',
  'connection-types': ['3G'],
  'connection-requirements-description': 'Text',
};

runTestSuite({
  data: mobileConnectionData,
  sectionId,
  dashboardId,
});
