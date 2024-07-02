import axiosInstance from "./axios";

interface ISignUpBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ISignInBody {
  email: string;
  password: string;
}

const AuthApi = {
  signUp: (data: ISignUpBody) => {
    return axiosInstance.post("/auth/signup", data);
  },
  signIn: (data: ISignInBody) => {
    return axiosInstance.post("/auth/signin", data);
  },
};

export default AuthApi;
