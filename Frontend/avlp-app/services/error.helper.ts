// services/error.helper.ts
export const handleApiError = (error: any) => {
    if (error.response && error.response.data) {
      return new Error(error.response.data.message || "Something went wrong");
    }
    return new Error(error.message || "Network error");
  };
  