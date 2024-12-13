import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

const toSession = (
  token: JWT,
  defaultSession?: Session
): Session => {
  return {
    ...(defaultSession || {}),
    error: token.error,
    user: {
      ...(defaultSession?.user || {}),
      ...token.user,
    },
    accessToken: token.accessToken,
    expires: defaultSession?.expires || "",
  };
};

export default toSession