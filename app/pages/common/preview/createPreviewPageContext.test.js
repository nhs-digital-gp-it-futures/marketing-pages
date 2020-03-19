import { createPreviewPageContext } from './createPreviewPageContext';

const expectedContext = {
  solutionHeader: {
    id: '100000-001',
    name: 'Write on Time',
    supplierName: 'Really Kool Corporation',
    isFoundation: true,
    lastUpdated: '1996-03-15T10:00:00',
  },
  returnToDashboardUrl: '../100000-001',
};

const previewData = {
  id: '100000-001',
  name: 'Write on Time',
  supplierName: 'Really Kool Corporation',
  isFoundation: true,
  lastUpdated: '1996-03-15T10:00:00',
};

describe('createPreviewPageContext', () => {
  it('should return the sections provided in the previewData', () => {
    const newExpectedContext = {
      ...expectedContext,
      sections: {
        'some-section': {
          answers: {},
        },
      },
    };
    const newPreviewData = {
      ...previewData,
      sections: {
        'some-section': {
          answers: {},
        },
      },
    };

    const context = createPreviewPageContext({ previewData: newPreviewData });

    expect(context).toEqual(newExpectedContext);
  });

  it('should create documentLink for all documentName', () => {
    const newExpectedContext = {
      ...expectedContext,
      sections: {
        'some-section': {
          answers: {
            'document-link': 'document/document.pdf',
          },
        },
      },
    };

    const newPreviewData = {
      ...previewData,
      sections: {
        'some-section': {
          answers: {
            'document-name': 'document.pdf',
          },
        },
      },
    };

    const context = createPreviewPageContext({ previewData: newPreviewData });

    expect(context).toEqual(newExpectedContext);
  });

  it('should maintain other properties', () => {
    const newExpectedContext = {
      ...expectedContext,
      sections: {
        'some-section': {
          answers: {
            'an-answer': true,
            'document-link': 'document/document.pdf',
          },
        },
      },
    };

    const newPreviewData = {
      ...previewData,
      sections: {
        'some-section': {
          answers: {
            'an-answer': true,
            'document-name': 'document.pdf',
          },
        },
      },
    };

    const context = createPreviewPageContext({ previewData: newPreviewData });

    expect(context).toEqual(newExpectedContext);
  });

  it('should manage multiple sections', () => {
    const newExpectedContext = {
      ...expectedContext,
      sections: {
        'first-section': {
          answers: {
            'an-answer': true,
            'document-link': 'document/document.pdf',
          },
        },
        'second-section': {
          answers: {
            'an-answer': true,
          },
        },
        'third-section': {
          answers: { },
        },
        'fourth-section': {
          answers: {
            'document-link': 'document/document.pdf',
          },
        },
      },
    };

    const newPreviewData = {
      ...previewData,
      sections: {
        'first-section': {
          answers: {
            'an-answer': true,
            'document-name': 'document.pdf',
          },
        },
        'second-section': {
          answers: {
            'an-answer': true,
          },
        },
        'third-section': {
          answers: { },
        },
        'fourth-section': {
          answers: {
            'document-name': 'document.pdf',
          },
        },
      },
    };

    const context = createPreviewPageContext({ previewData: newPreviewData });

    expect(context).toEqual(newExpectedContext);
  });
});
