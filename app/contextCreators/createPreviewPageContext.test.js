import { createPreviewPageContext } from './createPreviewPageContext';
import { ManifestProvider } from '../forms/manifestProvider';

jest.mock('../forms/manifestProvider');

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

  it('should return the sections and updated values', () => {
    const expectedContext = {
      sections: {
        'some-section': {
          answers: {
            'some-question': ['Value one', 'Value two'],
            'some-other-question': 'some value',
          },
        },
      },
    };

    const previewData = {
      sections: {
        'some-section': {
          answers: {
            'some-question': ['value-one', 'value-two'],
            'some-other-question': 'some value',
          },
        },
      },
    };

    ManifestProvider.prototype.getOptionsManifest.mockReturnValue(
      {
        'some-question': {
          options: {
            'value-one': 'Value one',
            'value-two': 'Value two',
          },
        },
      },
    );

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });

  it('should return multiple sections and updated values for section with an options manifest', () => {
    const expectedContext = {
      sections: {
        'some-section': {
          answers: {
            'some-first-question': ['Value one', 'Value two'],
            'some-second-question': 'some value',
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
        'some-section': {
          answers: {
            'some-first-question': ['value-one', 'value-two'],
            'some-second-question': 'some value',
          },
        },
        'some-other-section': {
          answers: {
            'some-other-question': 'some other value',
          },
        },
      },
    };

    ManifestProvider.prototype.getOptionsManifest.mockReturnValueOnce(
      {
        'some-first-question': {
          options: {
            'value-one': 'Value one',
            'value-two': 'Value two',
          },
        },
      },
    );
    ManifestProvider.prototype.getOptionsManifest.mockReturnValueOnce(undefined);

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

    ManifestProvider.prototype.getOptionsManifest.mockReturnValueOnce(undefined);

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });

  it('should return the sections and sub sections with updated values', () => {
    const expectedContext = {
      sections: {
        'some-first-section': {
          answers: {
            'some-first-question': 'some first data',
          },
        },
        'some-second-section': {
          sections: {
            'some-other-section': {
              sections: {
                'some-other-sub-section': {
                  answers: {
                    'some-question-1': ['Value one', 'Value two'],
                    'some-question-2': 'some value',
                    'some-question-3': 'Yes',
                  },
                },
                'some-other-second-sub-section': {
                  answers: {
                    'some-other-question': 'some value',
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
        'some-first-section': {
          answers: {
            'some-first-question': 'some first data',
          },
        },
        'some-second-section': {
          sections: {
            'some-other-section': {
              sections: {
                'some-other-sub-section': {
                  answers: {
                    'some-question-1': ['value-one', 'value-two'],
                    'some-question-2': 'some value',
                    'some-question-3': 'yes',
                  },
                },
                'some-other-second-sub-section': {
                  answers: {
                    'some-other-question': 'some value',
                  },
                },
              },
            },
          },
        },
      },
    };

    ManifestProvider.prototype.getOptionsManifest.mockReturnValueOnce(undefined);
    ManifestProvider.prototype.getOptionsManifest.mockReturnValueOnce(
      {
        'some-question-1': {
          options: {
            'value-one': 'Value one',
            'value-two': 'Value two',
          },
        },
        'some-question-3': {
          options: {
            yes: 'Yes',
            no: 'No',
          },
        },
      },
    );
    ManifestProvider.prototype.getOptionsManifest.mockReturnValueOnce(undefined);

    const context = createPreviewPageContext(previewData);

    expect(context).toEqual(expectedContext);
  });
});
