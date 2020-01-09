import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'native-mobile-memory-and-storage';
const dashboardId = 'native-mobile';

const mobileMemoryAndStorageData = {
  'minimum-memory-requirement': '256MB',
  'storage-requirements-description': 'Some storage requirements description',
};

runTestSuite({
  data: mobileMemoryAndStorageData,
  sectionId,
  dashboardId,
});
