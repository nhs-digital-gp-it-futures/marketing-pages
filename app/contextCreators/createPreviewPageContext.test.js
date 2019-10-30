import { createPreviewPageContext } from './createPreviewPageContext';
// import { ManifestProvider } from '../forms/manifestProvider';

// jest.mock('../forms/manifestProvider');

describe('createPreviewPageContext', () => {
  it('should return the sections provided in the previewData', () => {
    const expectedContext = {
      sections: {
        'some-section-id': {
          answers: {},
        },
      },
    };

    const previewData = {
      id: 'some-solution-id',
      sections: {
        'some-section-id': {
          answers: {},
        },
      },
    };

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });

  it('should return the sections and sub sections provided in the previewData', () => {
    const expectedContext = {
      sections: {
        'some-section-id': {
          sections: {
            'some-sub-section-id': {
              sections: {
                'browsers-supported': {
                  answers: {
                    'supported-browsers': ['Google Chrome', 'Safari'],
                  },
                },
              },
            },
          },
        },
      },
    };

    const previewData = {
      sections: {
        'some-section-id': {
          sections: {
            'some-sub-section-id': {
              sections: {
                'browsers-supported': {
                  answers: {
                    'supported-browsers': ['google-chrome', 'safari'],
                  },
                },
              },
            },
          },
        },
      },
    };

    // ManifestProvider.getOptionsManifest('some-section-id').mockReturnValue(undefined);
    // ManifestProvider.getOptionsManifest('some-sub-section-id').mockReturnValue(undefined);
    // ManifestProvider.getOptionsManifest('another-sub-section-id').mockReturnValue(
    //   {
    //     'some-question-id': {
    //       options: {
    //         'value-one': 'Value one',
    //         'value-two': 'Value two',
    //       },
    //     },
    //   },
    // );

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });

  it('should return the sections and updated values', () => {
    const expectedContext = {
      sections: {
        'browsers-supported': {
          answers: {
            'supported-browsers': ['Google Chrome', 'Safari'],
            'some-other-question': 'some value',
          },
        },
      },
    };

    const previewData = {
      sections: {
        'browsers-supported': {
          answers: {
            'supported-browsers': ['google-chrome', 'safari'],
            'some-other-question': 'some value',
          },
        },
      },
    };

    // ManifestProvider.getOptionsManifest('some-section-id').mockReturnValue(undefined);
    // ManifestProvider.getOptionsManifest('some-sub-section-id').mockReturnValue(undefined);
    // ManifestProvider.getOptionsManifest('another-sub-section-id').mockReturnValue(
    //   {
    //     'some-question-id': {
    //       options: {
    //         'value-one': 'Value one',
    //         'value-two': 'Value two',
    //       },
    //     },
    //   },
    // );

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });

  it('should return the sections and updated values', () => {
    const expectedContext = {
      sections: {
        'browsers-supported': {
          answers: {
            'supported-browsers': ['Google Chrome', 'Safari'],
            'some-question': 'some value',
          },
        },
        'some-other-section': {
          answers: {
            'some-other-question': 'some other value',
          },
        },
      },
    };

    const previewData = {
      sections: {
        'browsers-supported': {
          answers: {
            'supported-browsers': ['google-chrome', 'safari'],
            'some-question': 'some value',
          },
        },
        'some-other-section': {
          answers: {
            'some-other-question': 'some other value',
          },
        },
      },
    };

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });

  it('should return the sections and sub sections', () => {
    const expectedContext = {
      sections: {
        'some-section-id': {
          sections: {
            'some-sub-section-id': {
              answers: {
                'some-question': 'some value',
                'some-other-question': 'some other value',
              },
            },
          },
        },
      },
    };

    const previewData = {
      sections: {
        'some-section-id': {
          sections: {
            'some-sub-section-id': {
              answers: {
                'some-question': 'some value',
                'some-other-question': 'some other value',
              },
            },
          },
        },
      },
    };

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });

  it('should return the sections and sub sections with updated values', () => {
    const expectedContext = {
      sections: {
        'some-first-section-id': {
          answers: {
            'some-first-question': 'some first data',
          },
        },
        'some-section-id': {
          sections: {
            'some-other-section-id': {
              sections: {
                'browsers-supported': {
                  answers: {
                    'supported-browsers': ['Google Chrome', 'Safari'],
                    'some-other-question': 'some other value',
                    'mobile-responsive': 'Yes',
                  },
                },
                'some-section': {
                  answers: {
                    'some-question': 'some, value',
                  },
                },
              },
            },
          },
        },
      },
    };

    const previewData = {
      sections: {
        'some-first-section-id': {
          answers: {
            'some-first-question': 'some first data',
          },
        },
        'some-section-id': {
          sections: {
            'some-other-section-id': {
              sections: {
                'browsers-supported': {
                  answers: {
                    'supported-browsers': ['google-chrome', 'safari'],
                    'some-other-question': 'some other value',
                    'mobile-responsive': 'yes',
                  },
                },
                'some-section': {
                  answers: {
                    'some-question': 'some, value',
                  },
                },
              },
            },
          },
        },
      },
    };

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });
});
