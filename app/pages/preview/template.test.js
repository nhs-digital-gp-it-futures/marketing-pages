import { createTestHarness } from '../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/preview/template.njk',
  },
};

describe('preview page', () => {
  it('should render the backLink component', createTestHarness(setup, (harness) => {
    const context = {
      returnToDashboardUrl: '/supplier/solution/100000-001',
    };

    harness.request(context, ($) => {
      const backLink = $('[data-test-id="view-solution-page-back-link"] a');
      expect(backLink.length).toEqual(1);
      expect(backLink.text().trim()).toEqual('Go back to previous page');
    });
  }));

  it('should render the viewSolution component', createTestHarness(setup, (harness) => {
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
