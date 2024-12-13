import axios from "@/app/axios";
import { LoginResponse } from "./types";

const signIn = async (params: { email: string; password: string }) => {
    const { email, password } = params;
    const response = await axios.post<{
        data: LoginResponse;
    }>(`http://localhost:4000/api/session`, {
        user: {
            email: email,
            password: password,
        },
    });

    return response.data?.data;
};

export default signIn;