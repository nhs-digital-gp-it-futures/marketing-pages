import { transformCsv } from './transformCsv';

describe('transformCsv', () => {
  it('should transform an empty csv to an empty array', async () => {
    const expectedTransform = [];
    const csv = '';

    const transformedData = await transformCsv({ csv });
    expect(transformedData).toEqual(expectedTransform);
  });

  it('should transform a single csv capability mapping', async () => {
    const expectedTransform = ['C1'];

    const csv = `SolutionID,Capability ID
    100000-001,C1`;

    const transformedData = await transformCsv({ csv });

    expect(transformedData).toEqual(expectedTransform);
  });

  it('should transform multiple csv capability mappings', async () => {
    const expectedTransform = ['C20', 'C17', 'C12', 'C16'];
    const questionId = 'capabilities';

    const csv = 'SolutionID,Capability ID\r\n10000-001,C20\r\n10000-001,C17\r\n10000-001,C12\r\n10000-001,C16';

    const transformedData = await transformCsv({ questionId, csv });

    expect(transformedData).toEqual(expectedTransform);
  });

  it('should only add capabilities which have been provided', async () => {
    const expectedTransform = ['C20', 'C12', 'C16'];
    const questionId = 'capabilities';

    const csv = 'SolutionID,Capability ID\r\n10000-001,C20\r\n10000-001,\r\n10000-001,C12\r\n10000-001,C16\r\n10000-001';

    const transformedData = await transformCsv({ questionId, csv });

    expect(transformedData).toEqual(expectedTransform);
  });
});
