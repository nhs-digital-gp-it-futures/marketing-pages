import { createTestHarness } from '../../../../test-utils/testHarness';

const aSectionContext = (
  id, sections = undefined,
) => ({
  params: {
    section: {
      id,
      sections,
    },
  },
});

const setup = {
  component: {
    name: 'dashboardSectionRow',
    path: 'pages/common/dashboard/components/dashboard-section-row.njk',
  },
};

describe('dashboard-section-row', () => {
  it('should render the dashboard section', createTestHarness(setup, (harness) => {
    const context = aSectionContext('some-section-id');

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-some-section-id"]').length).toEqual(1);
    });
  }));

  it('should not render the dashboard sub sections if no sections are provided', createTestHarness(setup, (harness) => {
    const context = aSectionContext('some-section-id');
    harness.request(context, ($) => {
      expect($('[data-test-id^="dashboard-sub-section"]').length).toEqual(0);
    });
  }));

  it('should render the all the section and all the sub sections', createTestHarness(setup, (harness) => {
    const context = aSectionContext('some-section-id', [
      aSectionContext('first-sub-section-id'),
      aSectionContext('second-sub-section-id'),
    ]);

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-some-section-id"]').length).toEqual(1);
      expect($('[data-test-id^="dashboard-sub-section-"]').length).toEqual(2);
    });
  }));
});
