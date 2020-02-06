import csvtojson from 'csvtojson';

const formatting = {
  capabilities: csvRow => csvRow['Capability ID'],
  epics: (csvRow) => {
    if (csvRow['Epic ID'] && csvRow['Epic Final Assessment Result']) {
      return { [csvRow['Epic ID']]: csvRow['Epic Final Assessment Result'] };
    }
    return undefined;
  },
};

export const transformCsv = async ({ questionId, csv }) => {
  if (!csv.trim().length) return [];

  const json = await csvtojson({ trim: true, ignoreEmpty: true }).fromString(csv);
  return json.reduce((acc, csvRow) => {
    const formattedValue = formatting[questionId](csvRow);
    if (formattedValue) acc.push(formattedValue);
    return acc;
  }, []);
};
