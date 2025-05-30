import api from "@/lib/api";

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface IUserRegistration extends IUserCredentials {
  name: string;
}

export const login = async (credentials: IUserCredentials): Promise<string> => {
  try {
    const response = await api.post<{ token: string }>("/api/auth/login", credentials);
    return response.data.token;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login gagal. Silakan coba lagi.");
  }
};

export const register = async (userData: IUserRegistration): Promise<any> => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registrasi gagal. Silakan coba lagi.");
  }
};
