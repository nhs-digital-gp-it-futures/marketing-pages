import { createPreviewPageContext } from './createPreviewPageContext';

describe('createPreviewPageContext', () => {
  it('should create a context from the preview manifest with a title', () => {
    const expectedContext = {
      sections: [
        {
          title: 'Some section title',
          questions: [],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-id',
        title: 'Some section title',
        questions: [],
      }];

    const context = createPreviewPageContext(previewManifest, {});

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the preview manifest with mulitple titles', () => {
    const expectedContext = {
      sections: [
        {
          title: 'Some first section title',
          questions: [],
        },
        {
          title: 'Some second section title',
          questions: [],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-first-id',
        title: 'Some first section title',
        questions: [],
      },
      {
        id: 'some-second-id',
        title: 'Some second section title',
        questions: [],
      },
    ];

    const context = createPreviewPageContext(previewManifest, {});

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the preview manifest with one section and one question', () => {
    const expectedContext = {
      sections: [
        {
          title: 'Some first section title',
          questions: [
            {
              id: 'Some-question-id',
              title: 'Some question preview title',
            },
          ],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-first-id',
        title: 'Some first section title',
        questions: [
          {
            id: 'Some-question-id',
            preview: {
              title: 'Some question preview title',
            },
          },
        ],
      },
    ];

    const context = createPreviewPageContext(previewManifest, {});

    expect(context).toEqual(expectedContext);
  });


  it('should create a context from the preview manifest with one section and one question with existing data', () => {
    // sections: [
    //     {
    //       title: 'Fawad is the man!',
    //       questions: [{
    //         id: 'questionId1',
    //         title: 'Question title',
    //         data: 'Test data 1',
    //       }],
    //     },

    const expectedContext = {
      sections: [
        {
          title: 'Some section title',
          questions: [
            {
              id: 'some-question-id',
              title: 'Some question preview title',
              data: 'some question data',
            },
          ],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-section-id',
        title: 'Some section title',
        questions: [
          {
            id: 'some-question-id',
            preview: {
              title: 'Some question preview title',
            },
          },
        ],
      },
    ];

    const existingSolutionData = {
      marketingData: {
        sections: [
          {
            id: 'some-section-id',
            data: {
              'some-question-id': 'some question data',
            },
            status: 'COMPLETE',
          },
        ],
      },
    };

    const context = createPreviewPageContext(previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });
});
