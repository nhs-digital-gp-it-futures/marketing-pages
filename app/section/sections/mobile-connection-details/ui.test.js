import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'mobile-connection-details';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/native-mobile';

const mobileConnectionData = {
  'minimum-connection-speed': '3Mbps',
  'connection-types': ['3G'],
  'connection-requirements-description': 'Text',
};

runTestSuite({
  data: mobileConnectionData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  parentSectionApiUrl,
});
