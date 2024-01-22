import { reactive, toRefs } from "vue";
import axios from "axios";

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
  } catch (refreshError) {
    console.error("Error refreshing token", refreshError);
  }
};

const useApi = () => {
  initializeTokens();

  const get = async () => {
    const response = await api.get("http://localhost:3000/users", {
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

  const put = (url, data) => api.put(url, data);

  const del = (url) => api.delete(url);

  const { ...reactiveState } = toRefs(state);

  return { ...reactiveState, post, get, put, del, updateToken, setTokens };
};

export default useApi;
