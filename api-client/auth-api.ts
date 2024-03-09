import { IForgotPasswordPayload, ILogInPayload, ISignUpPayload } from "../common";
import ForgotPassword from "../forgot-password/page";
import axiosClient from "./axios-client";

export const authApi = {
  logIn(payload: ILogInPayload) {
    return axiosClient.post("api/auth/login", payload);
  },
  signUp(payload: ISignUpPayload) {
    return axiosClient.post("api/auth/signup", payload);
  },
  forgotPassword(payload: IForgotPasswordPayload) {
    return axiosClient.post("api/auth/forgot-password", payload);
  },
};