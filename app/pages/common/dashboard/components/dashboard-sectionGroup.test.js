import { createTestHarness } from '../../../../test-utils/testHarness';

const aSectionContext = title => ({
  URL: 'someUrl',
  title,
});

const aSectionGroupContext = (sections = []) => ({
  params: {
    sectionGroup: {
      id: 'some-sectionGroup-group-id',
      title: 'sectionGroup Group Title',
      sections,
    },
  },
});

const setup = {
  component: {
    name: 'dashboardSectionGroup',
    path: 'pages/common/dashboard/components/dashboard-sectionGroup.njk',
  },
};

describe('dashboard-sectionGroup', () => {
  it('should render the title of the sectionGroup group', createTestHarness(setup, (harness) => {
    const context = aSectionGroupContext();

    harness.request(context, ($) => {
      expect($('h2').text().trim()).toEqual('sectionGroup Group Title');
    });
  }));

  it('should render a section list of 1 if the sectionGroup group only contains the 1 section', createTestHarness(setup, (harness) => {
    const context = aSectionGroupContext([
      aSectionContext('Some section'),
    ]);

    harness.request(context, ($) => {
      expect($('.bc-c-section-list__item').length).toEqual(1);
    });
  }));

  it('should render a section list of 2 if the sectionGroup group contains 2 sections', createTestHarness(setup, (harness) => {
    const context = aSectionGroupContext([
      aSectionContext('Some First section'),
      aSectionContext('Some Second section'),
    ]);

    harness.request(context, ($) => {
      expect($('.bc-c-section-list__item').length).toEqual(2);
    });
  }));
});
