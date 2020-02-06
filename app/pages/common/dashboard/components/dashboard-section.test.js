import { createTestHarness } from '../../../../test-utils/testHarness';

const aSectionContext = (
  title, requirement = 'Mandatory', status = 'INCOMPLETE', isActive = true, defaultMessage = undefined,
) => ({
  params: {
    section: {
      URL: 'someUrl',
      title,
      requirement,
      status,
      isActive,
      defaultMessage,
    },
  },
});

const setup = {
  component: {
    name: 'dashboardSection',
    path: 'pages/common/dashboard/components/dashboard-section.njk',
  },
};

describe('dashboard-section', () => {
  it('should render the section title', createTestHarness(setup, (harness) => {
    const context = aSectionContext('Some section Title');

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-title"]').text().trim()).toEqual('Some section Title');
    });
  }));

  it('should render the requirement of the section', createTestHarness(setup, (harness) => {
    const context = aSectionContext('Some section Title');

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-requirement"]').text().trim()).toEqual('Mandatory');
    });
  }));

  it('should render status of the section as INCOMPLETE', createTestHarness(setup, (harness) => {
    const context = aSectionContext('Some section Title');

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-status"]').text().trim()).toEqual('INCOMPLETE');
    });
  }));

  it('should render status of the section as COMPLETE', createTestHarness(setup, (harness) => {
    const context = aSectionContext('Some section Title', 'Mandatory', 'COMPLETE');

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-status"]').text().trim()).toEqual('COMPLETE');
    });
  }));

  it('should render defaultMessage for the section if the showDetaultMessage flag is true', createTestHarness(setup, (harness) => {
    const context = aSectionContext('Some section Title', undefined, undefined, false, 'some default message');

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-default-message"]').text().trim()).toEqual('some default message');
    });
  }));

  it('should not render the section title as a link when not active', createTestHarness(setup, (harness) => {
    const context = aSectionContext('Some section Title', undefined, undefined, false, 'some default message');

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-section-title"] a').length).toEqual(0);
    });
  }));
});
