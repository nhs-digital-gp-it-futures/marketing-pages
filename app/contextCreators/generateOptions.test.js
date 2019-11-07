import { generateOptions } from './generateOptions';

describe('generateOptions', () => {
  it('should return undefined if an option manifest is not provided', () => {
    const expectedOptions = undefined;

    const optionsManifest = undefined;

    const options = generateOptions('some-question-id', optionsManifest);

    expect(options).toEqual(expectedOptions);
  });

  it('should return undefined if the questionId provided is not found in the optionsManifest', () => {
    const expectedOptions = undefined;

    const optionsManifest = {
      'some-other-question-id': {
        options: {
          'option-1': 'option 1',
          'option-2': 'option 2',
          'option-3': 'option 3',
        },
      },
    };

    const options = generateOptions('some-question-id', optionsManifest);

    expect(options).toEqual(expectedOptions);
  });

  it('should return the options based upon the option manifest provided', () => {
    const expectedOptions = [
      {
        text: 'option 1',
        value: 'option-1',
      },
      {
        text: 'option 2',
        value: 'option-2',
      },
      {
        text: 'option 3',
        value: 'option-3',
      },
    ];

    const optionsManifest = {
      'some-question-id': {
        options: {
          'option-1': 'option 1',
          'option-2': 'option 2',
          'option-3': 'option 3',
        },
      },
    };

    const options = generateOptions('some-question-id', optionsManifest);

    expect(options).toEqual(expectedOptions);
  });

  it('should return the options and marked the options as checked based upon the formData', () => {
    const expectedOptions = [
      {
        text: 'option 1',
        value: 'option-1',
        checked: true,
      },
      {
        text: 'option 2',
        value: 'option-2',
      },
      {
        text: 'option 3',
        value: 'option-3',
        checked: true,
      },
    ];

    const optionsManifest = {
      'some-question-id': {
        options: {
          'option-1': 'option 1',
          'option-2': 'option 2',
          'option-3': 'option 3',
        },
      },
    };

    const formData = {
      'some-question-id': [
        'option-1',
        'option-3',
      ],
    };

    const options = generateOptions('some-question-id', optionsManifest, formData);

    expect(options).toEqual(expectedOptions);
  });
});
