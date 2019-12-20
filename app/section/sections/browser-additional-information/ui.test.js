
import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'browser-additional-information';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/browser-based';

const additionalInformationData = {
  'additional-information': 'The solution additional information',
};

const fieldLengthMap = { 'additional-information': 500 };

runTestSuite({
  data: additionalInformationData,
  sectionApiUrl,
  sectionId,
  fieldLengthMap,
  clientUrl,
  parentSectionApiUrl,
});
