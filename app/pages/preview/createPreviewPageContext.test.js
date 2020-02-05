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
            'document-name': "document.pdf",
            'document-link': "../document/document.pdf"
          },
        },
      },
    };

    const previewData = {
      id: 'some-solution',
      sections: {
        'some-section': {
          answers: {
            'document-name': "document.pdf"            
          },
        },
      },
    };

    const context = createPreviewPageContext({ previewData });

    expect(context).toEqual(expectedContext);
  });
});
