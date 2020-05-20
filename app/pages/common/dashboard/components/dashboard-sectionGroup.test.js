import { componentTester } from '../../../../test-utils/componentTester';

const aSectionContext = title => ({
  URL: 'someUrl',
  title,
});

const aSectionGroupContext = (sections = []) => ({
  params: {
    sectionGroup: {
      id: 'some-sectionGroup-group-id',
      title: 'sectionGroup Group Title',
      mainAdvice: 'sectionGroup Group Main Advice',
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
  it('should render the title of the sectionGroup group', componentTester(setup, (harness) => {
    const context = aSectionGroupContext();

    harness.request(context, ($) => {
      expect($('h2').text().trim()).toEqual('sectionGroup Group Title');
    });
  }));

  it('should render the main advice of the sectionGroup group', componentTester(setup, (harness) => {
    const context = aSectionGroupContext();

    harness.request(context, ($) => {
      expect($('p').text().trim()).toEqual('sectionGroup Group Main Advice');
    });
  }));

  it('should render a section list of 1 if the sectionGroup group only contains the 1 section', componentTester(setup, (harness) => {
    const context = aSectionGroupContext([
      aSectionContext('Some section'),
    ]);

    harness.request(context, ($) => {
      expect($('.bc-c-section-list__item').length).toEqual(1);
    });
  }));

  it('should render a section list of 2 if the sectionGroup group contains 2 sections', componentTester(setup, (harness) => {
    const context = aSectionGroupContext([
      aSectionContext('Some First section'),
      aSectionContext('Some Second section'),
    ]);

    harness.request(context, ($) => {
      expect($('.bc-c-section-list__item').length).toEqual(2);
    });
  }));
});
