import { getExistingDataForFieldIfAvailable } from './getExistingDataForFieldIfAvailable';

describe('getExistingDataIfAvailable', () => {
  it('should return undefined if the exisitingDataForSection provided is undefined', () => {
    const exisitingDataForSection = undefined;

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForSection, 'some-question-id', 0);

    expect(existingDataForField).toEqual(undefined);
  });

  it('should return undefined if the exisitingDataForSection provided is an empty object', () => {
    const exisitingDataForSection = {};

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForSection, 'some-question-id', 0);

    expect(existingDataForField).toEqual(undefined);
  });

  it('should return undefined if the exisitingDataForSection if the value does not exist for the question', () => {
    const exisitingDataForSection = { 'some-question-id': [] };

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForSection, 'some-question-id', 0);

    expect(existingDataForField).toEqual(undefined);
  });

  it('should return the value at the specific index if existing data does exist for the question', () => {
    const exisitingDataForSection = { 'some-question-id': ['some-existing-data'] };

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForSection, 'some-question-id', 0);

    expect(existingDataForField).toEqual('some-existing-data');
  });
});
