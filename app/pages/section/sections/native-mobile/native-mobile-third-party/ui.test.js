import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'native-mobile-third-party';
const dashboardId = 'native-mobile';

const thirdPartyData = {
  'third-party-components': 'The application supports and requires an authenticator on each device the application is installed. You will need a software-based authenticator that implements a two-step verification service.',
  'device-capabilities': 'In order to use our file hosting services, the application will require permission to access device storage.',
};

runTestSuite({
  data: thirdPartyData,
  sectionId,
  dashboardId,
});
