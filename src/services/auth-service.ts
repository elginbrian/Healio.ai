import api from "@/lib/api";

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
}

export const login = async (credentials: IUserLogin): Promise<string> => {
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

export async function logout() {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Logout gagal");
  }
}
