import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'solution-description';

const solutionDescriptionMarketingData = {
  summary: 'The solution summary',
  description: 'The solution description',
  link: 'The solution link',
};

runTestSuite({
  data: solutionDescriptionMarketingData,
  sectionId,
});
