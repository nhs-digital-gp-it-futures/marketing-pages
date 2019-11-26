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

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });
});
