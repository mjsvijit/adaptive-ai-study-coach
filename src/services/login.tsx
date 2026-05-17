import axiosWrapper from "../axios/axios-wrapper";

function handleAgentLogin(values: { email_address: string; password: string }) {
  const payload = {
    identifier: values.email_address,
    password: values.password,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosWrapper.post(
        `${process.env["NEXT_PUBLIC_API_URL"]}/auth/local`,
        payload,
      );
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
}

function handleAgentRegister(values: any) {
  const payload = {
    username: `${values.firstName} ${values.lastName}`,
    email: values.email,
    password: values.password,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosWrapper.post(
        `${process.env["NEXT_PUBLIC_API_URL"]}/auth/local/register`,
        payload,
      );
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
}

export { handleAgentLogin, handleAgentRegister };
