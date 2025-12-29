import api from "./api";

export const getTestcases = (suiteId) => {
    return api.get(`/suites/${suiteId}/testcases`);
  };  

export const importTestcases = (suiteId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/testcases/import?suiteId=${suiteId}`, formData);
};

export const exportTestcases = (suiteId) => {
  return api.get(`/testcases/export?suiteId=${suiteId}`, {
    responseType: "blob",
  });
};
