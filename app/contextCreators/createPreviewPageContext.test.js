import { createPreviewPageContext } from './createPreviewPageContext';

describe('createPreviewPageContext', () => {
  it('should create a context from the preview manifest with a title', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-id',
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
        }],
      },
    ];

    const existingSolutionData = {
      marketingData: {
        sections: [
          {
            id: 'some-id',
            data: {},
            mandatory: ['some-question-id'],
          },
        ],
      },
    };

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the preview manifest with mulitple titles', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-first-id',
          title: 'some first section title',
          questions: [{
            id: 'some-first-question-id',
          }],
        },
        {
          id: 'some-second-id',
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
        }],
      },
      {
        id: 'some-second-id',
        title: 'some second section title',
        questions: [{
          id: 'some-second-question-id',
        }],
      },
    ];

    const existingSolutionData = {
      marketingData: {
        sections: [
          {
            id: 'some-first-id',
            data: {},
            mandatory: ['some-first-question-id'],
          },
          {
            id: 'some-second-id',
            data: {},
            mandatory: ['some-second-question-id'],
          },
        ],
      },
    };

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the preview manifest with one section and one question', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-first-id',
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

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should override the question type with the type provided in the preview config for the question', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-first-id',
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

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the preview manifest and not include the title of the question if not provided', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-first-id',
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

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the preview manifest with one section and one question with existing data', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-section-id',
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

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should not create question if optional and no data', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-section-id',
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
          },
          {
            id: 'some-other-question-id',
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
            mandatory: [],
            status: 'COMPLETE',
          },
        ],
      },
    };

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should create question if requirement is mandatory and whether there is data or not', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-section-id',
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
          },
          {
            id: 'some-other-question-id',
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
            mandatory: ['some-question-id'],
          },
        ],
      },
    };

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  it('should not create section if it has no questions', () => {
    const expectedContext = {
      submitPreviewUrl: '/some-solution-id/submitPreview',
      sections: [
        {
          id: 'some-section-id',
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
          },
        ],
      },
      {
        id: 'some-other-section-id',
        title: 'some other section title',
        questions: [
          {
            id: 'some-other-question-id',
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
            mandatory: ['some-question-id'],
          },
          {
            id: 'some-other-section-id',
            data: {},
            mandatory: [],
          },
        ],
      },
    };

    const context = createPreviewPageContext('some-solution-id', previewManifest, existingSolutionData);

    expect(context).toEqual(expectedContext);
  });

  describe('when previewValidationErrors are provided', () => {
    it('should create a context with the error message supplied for the question missing mandatory data', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        errors: [
          {
            text: 'some question is a required field',
            href: '#some-question-id',
          },
        ],
        sections: [
          {
            id: 'some-section-id',
            title: 'some section title',
            questions: [
              {
                id: 'some-question-id',
                error: {
                  message: 'some question is a required field',
                },
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
              submitValidations: [
                {
                  type: 'required',
                  message: 'some question is a required field',
                },
              ],
            },
            {
              id: 'some-other-question-id',
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
              mandatory: ['some-question-id'],
            },
          ],
        },
      };

      const previewValidationErrors = {
        'some-section-id': {
          required: ['some-question-id'],
        },
      };

      const context = createPreviewPageContext(
        'some-solution-id', previewManifest, existingSolutionData, previewValidationErrors,
      );

      expect(context).toEqual(expectedContext);
    });
  });
});
