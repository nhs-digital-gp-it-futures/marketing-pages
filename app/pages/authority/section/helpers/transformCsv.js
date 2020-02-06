import csvtojson from 'csvtojson';

export const transformCsv = async ({ csv }) => {
  if (!csv.trim().length) return [];

  const json = await csvtojson({ trim: true }).fromString(csv);

  return json.reduce((acc, ref) => {
    if (ref['Capability ID']) {
      acc.push(ref['Capability ID']);
    }
    return acc;
  }, []);
};
