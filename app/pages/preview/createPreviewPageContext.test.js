import { createPreviewPageContext } from './createPreviewPageContext';

describe('createPreviewPageContext', () => {
  it('should return the sections provided in the previewData', () => {
    const expectedContext = {
      sections: {
        'some-section': {
          answers: {},
        },
      },
    };

    const previewData = {
      id: 'some-solution',
      sections: {
        'some-section': {
          answers: {},
        },
      },
    };

    const context = createPreviewPageContext({ previewData });

    expect(context).toEqual(expectedContext);
  });

  it('should create documentLink for all documentName', () => {
    const expectedContext = {
      sections: {
        'some-section': {
          answers: {
            'document-link': 'document/document.pdf',
          },
        },
      },
    };

    const previewData = {
      id: 'some-solution',
      sections: {
        'some-section': {
          answers: {
            'document-name': 'document.pdf',
          },
        },
      },
    };

    const context = createPreviewPageContext({ previewData });

    expect(context).toEqual(expectedContext);
  });

  it('should maintain other properties', () => {
    const expectedContext = {
      sections: {
        'some-section': {
          answers: {
            'an-answer': true,
            'document-link': 'document/document.pdf',
          },
        },
      },
    };

    const previewData = {
      id: 'some-solution',
      sections: {
        'some-section': {
          answers: {
            'an-answer': true,
            'document-name': 'document.pdf',
          },
        },
      },
    };

    const context = createPreviewPageContext({ previewData });

    expect(context).toEqual(expectedContext);
  });

  it('should manage multiple sections', () => {
    const expectedContext = {
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

    const previewData = {
      id: 'some-solution',
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

    const context = createPreviewPageContext({ previewData });

    expect(context).toEqual(expectedContext);
  });
});
