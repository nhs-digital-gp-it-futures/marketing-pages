import { createPreviewPageContext } from './createPreviewPageContext';

describe('createPreviewPageContext', () => {
  it('should create a context from the preview manifest with a title', () => {
    const expectedContext = {
      sections: [
        {
          title: 'some section title',
          questions: [{
            id: 'some-question-id',
          }],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-id',
        title: 'some section title',
        questions: [{
          id: 'some-question-id',
          requirement: 'Mandatory',
        }],
      }];

    const context = createPreviewPageContext(previewManifest, {});

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the preview manifest with mulitple titles', () => {
    const expectedContext = {
      sections: [
        {
          title: 'some first section title',
          questions: [{
            id: 'some-first-question-id',
          }],
        },
        {
          title: 'some second section title',
          questions: [{
            id: 'some-second-question-id',
          }],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-first-id',
        title: 'some first section title',
        questions: [{
          id: 'some-first-question-id',
          requirement: 'Mandatory',
        }],
      },
      {
        id: 'some-second-id',
        title: 'some second section title',
        questions: [{
          id: 'some-second-question-id',
          requirement: 'Mandatory',
        }],
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

  it('should override the question type with the type provided in the preview config for the question', () => {
    const expectedContext = {
      sections: [
        {
          title: 'some first section title',
          questions: [
            {
              id: 'some-question-id',
              title: 'some question preview title',
              type: 'some-overrided-preview-type',
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
              type: 'some-overrided-preview-type',
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
          title: 'some first section title',
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
        title: 'some first section title',
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
          title: 'some section title',
          questions: [
            {
              id: 'some-question-id',
              title: 'some question preview title',
              data: 'some question data',
            },
          ],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-section-id',
        title: 'some section title',
        questions: [
          {
            id: 'some-question-id',
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
          title: 'some section title',
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
        title: 'some section title',
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

  it('should create question if requirement is mandatory and whether there is data or not', () => {
    const expectedContext = {
      sections: [
        {
          title: 'some section title',
          questions: [
            {
              id: 'some-question-id',
            },
          ],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-section-id',
        title: 'some section title',
        questions: [
          {
            id: 'some-question-id',
            requirement: 'Mandatory',
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
            data: {},
          },
        ],
      },
    };

    const context = createPreviewPageContext(previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should not create section if it has no questions', () => {
    const expectedContext = {
      sections: [
        {
          title: 'some section title',
          questions: [
            {
              id: 'some-question-id',
            },
          ],
        },
      ],
    };

    const previewManifest = [
      {
        id: 'some-section-id',
        title: 'some section title',
        questions: [
          {
            id: 'some-question-id',
            requirement: 'Mandatory',
          },
        ],
      },
      {
        id: 'some-other-section-id',
        title: 'some other section title',
        questions: [
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
            data: {},
          },
          {
            id: 'some-other-section-id',
            data: {},
          },
        ],
      },
    };

    const context = createPreviewPageContext(previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });
});
