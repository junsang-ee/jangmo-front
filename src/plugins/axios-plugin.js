import Axios from "axios";
import { useTokenStore } from "@/store/auth";
import { useLoadingStore } from "@/store/loading";
import router from "@/router/router";

Axios.defaults.timeout = 10 * 1000;
Axios.defaults.headers.common.Accept = "application/json";
Axios.defaults.headers.common.ContentType = "application/json";

const $axios = Axios;

const vueAxios = {
  async install(app) {
    const $auth = useTokenStore();
    const $loading = useLoadingStore();
    $axios.defaults.baseURL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`
    if (import.meta.env.VITE_USER_NODE_ENV === "prod") {
      $axios.defaults.baseURL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}`
    }
    const vue = app.config.globalProperties;

    $axios.interceptors.request.use(
      (config) => {
        console.log(`Request : ${config.url}, ${JSON.stringify(config.params)}`);
        if (config.method !== "get") {
          $loading.setLoading(true);
        }
        let token = $auth.getToken();
        if (token) {
          config.headers.Authorization = `${token}`;
        }
        return config;
      },
      (error) => {
        $loading.setLoading(false);
        return Promise.reject(error);
      }
    );

    $axios.interceptors.response.use(
      (response) => {
        $loading.setLoading(false);
        const responseCode = response.data?.code ?? 0;
        if (responseCode > 1) {
          const err = new Error(response.data?.message || "알 수 없는 에러가 발생하였습니다.");
          err.response = response;
          return Promise.reject(err);
        }
        return response.data?.data;
      },
      (error) => {
        $loading.setLoading(false);
        const response = error.response;

        if (!response?.data)
          return Promise.reject(error);

        const {code, message} = error.response.data;
        const err = new Error(message || "알 수 없는 에러입니다.");
        err.code = code;
        if (response.status === 401) {
          if (code === 4000) {
            router.replace({name: "Login"});
          }
        } else if (response.status === 500) {
          router.replace({name: "InternalServer"});
        }
        return Promise.reject(err);
      }
    );
    vue.$axios = $axios;
  },
};

export { $axios, vueAxios };
