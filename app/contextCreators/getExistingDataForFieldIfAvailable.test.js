import { getExistingDataForFieldIfAvailable } from './getExistingDataForFieldIfAvailable';

describe('getExistingDataIfAvailable', () => {
  it('should return undefined if the exisitingDataForTask provided is undefined', () => {
    const exisitingDataForTask = undefined;

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForTask, 'some-question-id', 0);

    expect(existingDataForField).toEqual(undefined);
  });

  it('should return undefined if the exisitingDataForTask if there is no data property', () => {
    const exisitingDataForTask = {};

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForTask, 'some-question-id', 0);

    expect(existingDataForField).toEqual(undefined);
  });

  it('should return undefined if the exisitingDataForTask if the question does not exist within the data property', () => {
    const exisitingDataForTask = { data: {} };

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForTask, 'some-question-id', 0);

    expect(existingDataForField).toEqual(undefined);
  });

  it('should return undefined if the exisitingDataForTask if the value does not exist for the question', () => {
    const exisitingDataForTask = { data: { 'some-question-id': [] } };

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForTask, 'some-question-id', 0);

    expect(existingDataForField).toEqual(undefined);
  });

  it('should return the value at the specific index if existing data does exist for the question', () => {
    const exisitingDataForTask = { data: { 'some-question-id': ['some-existing-data'] } };

    const existingDataForField = getExistingDataForFieldIfAvailable(exisitingDataForTask, 'some-question-id', 0);

    expect(existingDataForField).toEqual('some-existing-data');
  });
});
