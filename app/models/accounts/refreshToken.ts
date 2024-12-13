import axios from "@/app/axios";
import { LoginResponse } from "./types";

const refreshToken = async (params: { token: string }) => {
  const { token } = params;
  const response = await axios.post<{
    data: LoginResponse;
  }>(
    `${process.env.API_URL}/api/session/renew`,
    {},
    { headers: { Authorization: token } }
  );

  return response.data?.data;
};

export default refreshToken;