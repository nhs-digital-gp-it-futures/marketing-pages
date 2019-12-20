import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'solution-description';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/section/${sectionId}`;

const solutionDescriptionMarketingData = {
  summary: 'The solution summary',
  description: 'The solution description',
  link: 'The solution link',
};

// not sure what maxLength of link is
const fieldLengthMap = { summary: 300, description: 1000, link: 50 };

runTestSuite({
  data: solutionDescriptionMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  fieldLengthMap,
});
