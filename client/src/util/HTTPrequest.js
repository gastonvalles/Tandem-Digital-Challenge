import { reactive, toRefs } from "vue";
import axios from "axios";

// Define state fuera de la función updateToken
const state = reactive({
  accessToken: null,
  refreshToken: null,
});

const setTokens = (accessToken, refreshToken) => {
  state.accessToken = accessToken;
  state.refreshToken = refreshToken;

  sessionStorage.setItem("accessToken", accessToken);
  sessionStorage.setItem("refreshToken", refreshToken);
};

const initializeTokens = () => {
  const storedAccessToken = sessionStorage.getItem("accessToken");
  const storedRefreshToken = sessionStorage.getItem("refreshToken");

  if (storedAccessToken && storedRefreshToken) {
    state.accessToken = storedAccessToken;
    state.refreshToken = storedRefreshToken;
  }
};

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const updateToken = async () => {
  try {
    const response = await api.post("/refresh-token", {
      refreshToken: state.refreshToken,
    });
    const { newAccessToken } = response.data;
    state.accessToken = newAccessToken;
    return newAccessToken;
  } catch (refreshError) {
    console.error("Error refreshing token", refreshError);
    throw refreshError;
  }
};

// Agrega un interceptor de respuesta para manejar automáticamente la actualización del token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Si la solicitud falla debido a un token caducado, intenta actualizar el token y vuelve a intentar la solicitud original.
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await updateToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si la actualización del token también falla, redirige al usuario a la página de inicio de sesión o realiza alguna otra acción.
        console.error("Error refreshing token", refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

const useApi = () => {
  initializeTokens(); // Inicializa los tokens

  const get = async (url) => {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${state.accessToken}`,
      },
    });

    return response;
  };

  const post = async (url, data) => {
    const response = await api.post(url, data);
    return response;
  };

  const put = async (url, data) => {
    const response = await api.put(url, data, {
      headers: {
        Authorization: `Bearer ${state.accessToken}`,
      },
    });

    return response;
  };

  const del = (url) => api.delete(url);

  const { ...reactiveState } = toRefs(state);

  return { ...reactiveState, post, get, put, del, updateToken, setTokens };
};

export default useApi;
