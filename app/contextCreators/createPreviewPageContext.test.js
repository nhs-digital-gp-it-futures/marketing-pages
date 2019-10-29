import { createPreviewPageContext } from './createPreviewPageContext';


describe('createPreviewPageContext', () => {
  it('should return the sections provided in the previewData', () => {
    const expectedContext = {
      sections: {
        'some-section-id': {},
      },
    };

    const previewData = {
      id: 'some-solution-id',
      sections: {
        'some-section-id': {},
      },
    };

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });
});
