import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-memory-and-storage';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/native-mobile/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/native-mobile';

const mobileMemoryAndStorageData = {
  'minimum-memory-requirement': '256MB',
  'storage-requirements-description': 'Some storage requirements description',
};

runTestSuite({
  data: mobileMemoryAndStorageData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  parentSectionApiUrl,
});
