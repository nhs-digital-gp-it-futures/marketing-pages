const createRedirectUrl = (
  solutionId, successfulSubmitResponsePath,
) => {
  const defaultUrl = `/${solutionId}`;

  if (successfulSubmitResponsePath) {
    return `${defaultUrl}/${successfulSubmitResponsePath}`;
  }

  return defaultUrl;
};

export const createPostSectionResponse = (solutionId, sectionManifest) => {
  const response = {
    success: true,
    redirectUrl: createRedirectUrl(solutionId, sectionManifest.successfulSubmitResponsePath),
  };

  return response;
};
