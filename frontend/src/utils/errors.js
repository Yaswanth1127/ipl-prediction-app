export const getRequestErrorMessage = (error, fallback) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the backend. Make sure MongoDB and the backend server are running, then try again.";
  }

  return fallback;
};
