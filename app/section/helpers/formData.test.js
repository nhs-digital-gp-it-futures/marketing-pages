import { getFormDataValue, doesFormDataContainValue } from './formData';

describe('getFormDataValue', () => {
  it('should return some value when the key is matched', () => {
    const formData = {
      'some-key': 'some-value',
    };
    const result = getFormDataValue({ key: 'some-key', formData });

    expect(result).toEqual('some-value');
  });

  it('should return an array of data when the key is matched with an array property', () => {
    const formData = {
      'some-key': ['some-value', 'some-other-value'],
    };
    const result = getFormDataValue({ key: 'some-key', formData });

    expect(result).toEqual(['some-value', 'some-other-value']);
  });

  it('should return undefined when form data is undefined', () => {
    const result = getFormDataValue({ key: 'some-key' });

    expect(result).toEqual(undefined);
  });

  it('should return undefined when key is undefined', () => {
    const formData = {
      'some-key': 'some-value',
    };
    const result = getFormDataValue({ formData });

    expect(result).toEqual(undefined);
  });

  it('should return undefined when form data is empty', () => {
    const formData = {};
    const result = getFormDataValue({ key: 'some-key', formData });

    expect(result).toEqual(undefined);
  });

  it('should return undefined when the key does not match', () => {
    const formData = {
      'some-other-key': 'some-value',
    };
    const result = getFormDataValue({ key: 'some-key', formData });

    expect(result).toEqual(undefined);
  });
});

describe('doesFormDataContainValue', () => {
  it('should return true when key and value match the form data', () => {
    const formData = {
      'some-key': 'some-value',
    };
    const result = doesFormDataContainValue('some-key', 'some-value', formData);

    expect(result).toEqual(true);
  });

  it('should return true when the key and value match an array element within the form data', () => {
    const formData = {
      'some-key': ['some-value', 'some-other-value'],
    };
    const result = doesFormDataContainValue('some-key', 'some-other-value', formData);

    expect(result).toEqual(true);
  });

  it('should return false when the key matches an array property but the value is not within the array', () => {
    const formData = {
      'some-key': ['first-value', 'second-value'],
    };
    const result = doesFormDataContainValue('some-key', 'some-value', formData);

    expect(result).toEqual(false);
  });

  it('should return false when the key matches an array property but the array is empty', () => {
    const formData = {
      'some-key': [],
    };
    const result = doesFormDataContainValue('some-key', 'some-value', formData);

    expect(result).toEqual(false);
  });

  it('should return false when the form data is undefined', () => {
    const result = doesFormDataContainValue('some-key', 'some-value', undefined);

    expect(result).toEqual(false);
  });

  it('should return false when key is undefined', () => {
    const formData = {
      'some-key': 'some-value',
    };
    const result = doesFormDataContainValue(undefined, 'some-value', formData);

    expect(result).toEqual(false);
  });

  it('should return false when the value is undefined', () => {
    const formData = {
      'some-key': 'some-value',
    };
    const result = doesFormDataContainValue('some-key', undefined, formData);

    expect(result).toEqual(false);
  });
});
