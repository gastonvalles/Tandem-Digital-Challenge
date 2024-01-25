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

export const initializeTokens = async () => {
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

export const updateToken = async () => {
  try {
    const response = await api.post("/refresh-token", {
      refreshToken: state.refreshToken,
    });
    const { newAccessToken } = response.data;
    setTokens(newAccessToken, state.refreshToken);
    return newAccessToken;
  } catch (refreshError) {
    console.error("Error refreshing token", refreshError);
    throw refreshError;
  }
};

const useApi = () => {
  initializeTokens();

  const get = async (url) => {
    try {
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error en la solicitud GET en useApi:", error);
      throw error;
    }
  };

  const post = async (url, data) => {
    try {
      const response = await api.post(url, data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error en la solicitud POST en useApi:", error);
      throw error;
    }
  };

  const put = async (url, data) => {
    try {
      const response = await api.put(url, data, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error en la solicitud PUT en useApi:", error);
      throw error;
    }
  };

  const del = async (url) => {
    try {
      const response = await api.delete(url, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error en la solicitud DEL en useApi:", error);
      throw error;
    }
  };

  const { ...reactiveState } = toRefs(state);

  return { ...reactiveState, post, get, put, del, updateToken, setTokens };
};

export default useApi;
