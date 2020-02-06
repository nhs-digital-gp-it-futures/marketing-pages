import { transformCsv } from './transformCsv';

describe('transformCsv', () => {
  it('should transform an empty csv to an empty array', async () => {
    const expectedTransform = [];
    const questionId = 'capabilities';
    const csv = '';

    const transformedData = await transformCsv({ questionId, csv });
    expect(transformedData).toEqual(expectedTransform);
  });

  describe('capabilities', () => {
    it('should transform a single csv capability mapping', async () => {
      const expectedTransform = ['C1'];
      const questionId = 'capabilities';
      const csv = `SolutionID,Capability ID
      100000-001,C1`;

      const transformedData = await transformCsv({ questionId, csv });

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

  describe('epics', () => {
    it('should transform a single csv epics mapping', async () => {
      const expectedTransform = [{ C20E13: 'Not Evidenced' }];
      const questionId = 'epics';
      const csv = `Supplier ID,Solution ID,Additional Service ID,Capability ID,Epic ID,Level,Epic Final Assessment Result
      10000,10000-001,,C20,C20E13,May,Not Evidenced`;

      const transformedData = await transformCsv({ questionId, csv });

      expect(transformedData).toEqual(expectedTransform);
    });

    it('should transform multiple csv epics mappings', async () => {
      const expectedTransform = [{ C20E13: 'Not Evidenced' }, { C20E11: 'Passed' }, { C20E12: 'Not Evidenced' }];
      const questionId = 'epics';
      const csv = 'Supplier ID,Solution ID,Additional Service ID,Capability ID,Epic ID,Level,Epic Final Assessment Result\r\n10000,10000-001,,C20,C20E13,May,Not Evidenced\r\n10000,10000-001,,C20,C20E11,Must,Passed\r\n10000,10000-001,,C20,C20E12,May,Not Evidenced';

      const transformedData = await transformCsv({ questionId, csv });

      expect(transformedData).toEqual(expectedTransform);
    });

    it('should only add epics which have been provided', async () => {
      const expectedTransform = [{ C20E11: 'Passed' }];
      const questionId = 'epics';

      const csv = `Supplier ID,Solution ID,Additional Service ID,Capability ID,Epic ID,Level,Epic Final Assessment Result
      10000,10000-001,,C20,,May,Not Evidenced
      10000,10000-001,,C20,C20E11,Must,Passed
      10000,10000-001,,C20,C20E12,May,`;
      const transformedData = await transformCsv({ questionId, csv });

      expect(transformedData).toEqual(expectedTransform);
    });
  });
});
