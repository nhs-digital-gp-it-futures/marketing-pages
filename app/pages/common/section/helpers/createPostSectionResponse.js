const createRedirectUrl = ({
  solutionId, successfulSubmitResponsePath,
}) => {
  const defaultUrl = `/supplier/solution/${solutionId}`;

  if (successfulSubmitResponsePath) {
    return `${defaultUrl}/${successfulSubmitResponsePath}`;
  }

  return defaultUrl;
};

export const createPostSectionResponse = ({ solutionId, sectionManifest }) => {
  const response = {
    success: true,
    redirectUrl: createRedirectUrl({
      solutionId, successfulSubmitResponsePath: sectionManifest.successfulSubmitResponsePath,
    }),
  };

  return response;
};
