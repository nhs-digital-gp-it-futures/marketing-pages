import { generateOptions } from './generateOptions';

describe('generateOptions', () => {
  it('should return undefined if an option manifest is not provided', () => {
    const expectedOptions = undefined;

    const options = undefined;

    const generatedOptions = generateOptions({ questionId: 'some-question-id', options });

    expect(generatedOptions).toEqual(expectedOptions);
  });

  it('should return the options based upon the option manifest provided', () => {
    const expectedOptions = [
      {
        text: 'option 1',
        value: 'option 1',
      },
      {
        text: 'option 2',
        value: 'option 2',
      },
      {
        text: 'option 3',
        value: 'option 3',
      },
    ];

    const options = {
      'option 1': 'option 1',
      'option 2': 'option 2',
      'option 3': 'option 3',
    };

    const generatedOptions = generateOptions({ questionId: 'some-question-id', options });

    expect(generatedOptions).toEqual(expectedOptions);
  });

  it('should return the options and marked the options as checked based upon the formData', () => {
    const expectedOptions = [
      {
        text: 'option 1',
        value: 'option 1',
        checked: true,
      },
      {
        text: 'option 2',
        value: 'option 2',
      },
      {
        text: 'option 3',
        value: 'option 3',
        checked: true,
      },
    ];

    const options = {
      'option 1': 'option 1',
      'option 2': 'option 2',
      'option 3': 'option 3',
    };

    const formData = {
      'some-question-id': [
        'option 1',
        'option 3',
      ],
    };

    const generatedOptions = generateOptions({ questionId: 'some-question-id', options, formData });

    expect(generatedOptions).toEqual(expectedOptions);
  });

  it('should return the options and marked the options as selected for combobox type questions', () => {
    const expectedOptions = [
      {
        text: 'option 1',
        value: 'option 1',
        selected: true,
      },
      {
        text: 'option 2',
        value: 'option 2',
      },
      {
        text: 'option 3',
        value: 'option 3',
      },
    ];

    const options = {
      'option 1': 'option 1',
      'option 2': 'option 2',
      'option 3': 'option 3',
    };

    const formData = {
      'some-question-id': [
        'option 1',
      ],
    };

    const generatedOptions = generateOptions({
      questionId: 'some-question-id',
      options,
      formData,
      questionType: 'combobox-options',
    });

    expect(generatedOptions).toEqual(expectedOptions);
  });
});
