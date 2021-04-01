import { componentTester, snapshotTest } from '../../../test-utils/componentTester';
import previewWithNoMarketingData from '../../../../fixtures/previewWithNoMarketingData.json';
import previewWithMarketingData from '../../../../fixtures/previewWithMarketingData.json';

const setup = {
  template: {
    path: 'pages/common/preview/template.njk',
  },
};

describe('preview page', () => {
  it('should render the page with data', componentTester(setup, (harness) => {
    harness.request(previewWithMarketingData, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  it('should render the page without data', componentTester(setup, (harness) => {
    harness.request(previewWithNoMarketingData, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  it('should render the backLink component', componentTester(setup, (harness) => {
    const context = {
      returnToDashboardUrl: '/supplier/solution/100000-001',
    };

    harness.request(context, ($) => {
      const backLink = $('[data-test-id="view-solution-page-back-link"] a');
      expect(backLink.length).toEqual(1);
      expect(backLink.text().trim()).toEqual('Go back to previous page');
      expect(backLink.attr('href')).toEqual('/supplier/solution/100000-001');
    });
  }));

  it('should render the viewSolution component', componentTester(setup, (harness) => {
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
      expect($('[data-test-id="view-solution-header"]').length).toBe(1);
    });
  }));
});
