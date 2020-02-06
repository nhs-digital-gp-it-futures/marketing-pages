import csvtojson from 'csvtojson';

export const csvCapabilityTransformation = (csv) => {
  if (csv.trim().length === 0) {
    return [];
  }
  const json = csvtojson({
    output: 'line',
    trim: true,
  })
    .fromString(csv)
    .then((a) => {
      console.log(`a ${JSON.stringify(a)}`);
      return a;
    });

  console.log(`json ${JSON.stringify(json)}`);

  return undefined;
};
