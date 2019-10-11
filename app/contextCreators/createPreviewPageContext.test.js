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
          title: 'some first section title',
          questions: [
            {
              id: 'some-question-id',
              title: 'some question preview title',
              type: 'some-question-type',
              data: 'some question data',
            },
          ],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-first-id',
        title: 'some first section title',
        questions: [
          {
            id: 'some-question-id',
            type: 'some-question-type',
            preview: {
              title: 'some question preview title',
            },
          },
        ],
      },
    ];

    const existingSolutionData = {
      marketingData: {
        sections: [
          {
            id: 'some-first-id',
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

  it('should create a context from the preview manifest and not include the title of the question if not provided', () => {
    const expectedContext = {
      sections: [
        {
          title: 'Some first section title',
          questions: [
            {
              id: 'some-question-id',
              type: 'some-question-type',
              data: 'some question data',
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
            id: 'some-question-id',
            type: 'some-question-type',
          },
        ],
      },
    ];

    const existingSolutionData = {
      marketingData: {
        sections: [
          {
            id: 'some-first-id',
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

  it('should create a context from the preview manifest with one section and one question with existing data', () => {
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

  it('should not create question if optional and no data', () => {
    const expectedContext = {
      sections: [
        {
          title: 'Some section title',
          questions: [
            {
              id: 'some-question-id',
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
            requirement: 'Optional',
          },
          {
            id: 'some-other-question-id',
            requirement: 'Optional',
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
