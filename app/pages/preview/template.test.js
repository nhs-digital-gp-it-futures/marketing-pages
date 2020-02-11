import { createTestHarness } from '../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/preview/template.njk',
  },
};

describe('preview page', () => {
  it('should render the title of the preview page', createTestHarness(setup, (harness) => {
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

  it('should render the solutions-description section when provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        'solution-description': {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-solution-description"]').length).toEqual(1);
    });
  }));

  it('should render the features section when provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        features: {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-features"]').length).toEqual(1);
    });
  }));

  describe('integrations', () => {
    it('should render the integrations section if link is provided', createTestHarness(setup, (harness) => {
      const context = {
        sections: {
          integrations: {
            answers: {
              link: 'link.com',
            },
          },
        },
      };

      harness.request(context, ($) => {
        expect($('[data-test-id="view-integrations"]').length).toEqual(1);
        expect($('[data-test-id="view-question-data-text-link-supplier-integrations"]').length).toEqual(1);
      });
    }));

    it('should render the integrations section document-link is provided', createTestHarness(setup, (harness) => {
      const context = {
        sections: {
          integrations: {
            answers: {
              'document-link': 'document.pdf',
            },
          },
        },
      };

      harness.request(context, ($) => {
        expect($('[data-test-id="view-integrations"]').length).toEqual(1);
        expect($('[data-test-id="view-question-data-text-link-authority-integrations"]').length).toEqual(1);
      });
    }));
  });

  it('should render the client application types section when provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        'client-application-types': {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-client-application-types"]').length).toEqual(1);
    });
  }));

  it('should render the hosting types section when one of the sections is provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        'hosting-type-private-cloud': {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-hosting-types"]').length).toEqual(1);
    });
  }));
});
