import { createTestHarness } from '../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/preview/template.njk',
  },
};

describe('preview page', () => {
  it('should render the viwSolution component', createTestHarness(setup, (harness) => {
    const context = {
      solutionHeader: {
        id: '100000-001',
        name: 'Write on Time',
        supplierName: 'Really Kool Corporation',
        isFoundation: true,
        lastUpdated: '1996-03-15T10:00:00',
      },
      returnToDashboardUrl: '/supplier/solution/100000-001',
    };

    harness.request(context, ($) => {
      expect($('h1').text().trim()).toEqual('Write on Time');
    });
  }));
});
