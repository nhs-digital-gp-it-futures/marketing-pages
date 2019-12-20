import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'client-application-types';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/section/${sectionId}`;

const mobileFirstMarketingData = {
  'client-application-types': ['native-mobile'],
};

runTestSuite({
  data: mobileFirstMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
});
