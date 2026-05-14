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

export {
  handleAgentLogin,
};
