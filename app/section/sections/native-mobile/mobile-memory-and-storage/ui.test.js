import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-memory-and-storage';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/native-mobile/section/${sectionId}`;
const dashboardId = 'native-mobile';

const mobileMemoryAndStorageData = {
  'minimum-memory-requirement': '256MB',
  'storage-requirements-description': 'Some storage requirements description',
};

runTestSuite({
  data: mobileMemoryAndStorageData,
  sectionId,
  clientUrl,
  dashboardId,
});
