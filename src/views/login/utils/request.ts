import { getUUID, generateCode, getSchoolInfo, login } from "@/api/user";
export const getUUIDRequest = () => {
  return new Promise((resolve, reject) => {
    getUUID()
      .then(({ result }) => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const generateCodeRequest = params => {
  return new Promise((resolve, reject) => {
    generateCode(params)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const getSchoolInfoRequest = params => {
  return new Promise((resolve, reject) => {
    getSchoolInfo(params)
      .then(({ result }) => {
        resolve(result);
      })
      .catch(({ message }) => {
        reject(message);
      });
  });
};
export const loginRequest = params => {
  return new Promise((resolve, reject) => {
    login(params)
      .then(({ result }) => {
        resolve(result);
      })
      .catch(({ message }) => {
        reject(message);
      });
  });
};
