import { JWT } from "next-auth/jwt";
import { LoginResponse } from "./types";

const toToken = (loginResponse: LoginResponse): JWT => {
  return {
    accessToken: loginResponse.access_token,
    expiredAt: loginResponse.expired_at,
    refreshToken: loginResponse.renewal_token,
    user: loginResponse.user,
  };
};

export default toToken;