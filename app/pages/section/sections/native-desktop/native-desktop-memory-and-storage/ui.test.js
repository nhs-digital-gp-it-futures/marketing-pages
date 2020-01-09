import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'native-desktop-memory-and-storage';
const dashboardId = 'native-desktop';

const memoryAndStorageMarketingData = {
  'minimum-memory-requirement': '4GB',
  'storage-requirements-description': 'You will need at least 2.5GB of free space on each device the application is installed.',
  'minimum-cpu': 'Intel Core i5-4460 (3.4GHz) Quad-core or Better.',
  'recommended-resolution': '16:9 - 1920 x 1080',
};

runTestSuite({
  data: memoryAndStorageMarketingData,
  sectionId,
  dashboardId,
});
