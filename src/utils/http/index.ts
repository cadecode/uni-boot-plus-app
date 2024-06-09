import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer
} from "axios";
import type {
  BasePureHttp,
  PureHttpError,
  PureHttpRequestConfig,
  PureHttpResponse
} from "./types.d";
import { stringify } from "qs";
import NProgress from "../progress";
import {
  formatToken,
  getToken,
  multipleTabsKey,
  removeToken
} from "@/utils/auth";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { routerArrays } from "@/layout/types";
import { resetRouter, router } from "@/router";
import { isFunction } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";

const { VITE_HTTP_BASE_URL } = import.meta.env;

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 60 * 1000,
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  },
  // 跨域是否携带 cookie
  // withCredentials: true,
  // baseUrl
  baseURL: VITE_HTTP_BASE_URL
};

class PureHttp implements BasePureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** 防止重复弹出重新登录确认 */
  private static IS_CONFIRMING_RE_LOGIN = false;

  /** 保存当前`Axios`实例对象 */
  private static AXIOS_INSTANCE: AxiosInstance = Axios.create(defaultConfig);

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.AXIOS_INSTANCE.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // 设置请求头 token
        config.headers[multipleTabsKey] = formatToken(getToken());
        // 执行回调
        isFunction(config.beforeRequestCallback) &&
          (await config.beforeRequestCallback(config));
        return config;
      },
      error => {
        console.error(error);
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    PureHttp.AXIOS_INSTANCE.interceptors.response.use(
      async (response: PureHttpResponse) => {
        // 关闭进度条动画
        NProgress.done();
        try {
          await this.checkResponseError(response);
        } finally {
          // 执行回调
          isFunction(response.config.beforeResponseCallback) &&
            (await response.config.beforeResponseCallback(response));
        }
        return response.data;
      },
      async (error: PureHttpError) => {
        error.isCancelRequest = Axios.isCancel(error);
        // 关闭进度条动画
        NProgress.done();
        const response = error.response;
        if (response && response.data) {
          try {
            await this.checkResponseError(response);
          } finally {
            // 执行回调
            isFunction(response.config.beforeResponseCallback) &&
              (await response.config.beforeResponseCallback(response, error));
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 检查 response 中携带的错误信息
   */
  private checkResponseError(response: PureHttpResponse) {
    const res = response.data;
    // 判断有没有返回 error
    if (!res || !res.error) {
      return;
    }
    // 401 未登录，跳转到登录页
    if (res.status === 401) {
      return this.confirmReLogin(res);
    }
    let errorMessage: string = res.error;
    // 若存在 message 则拼接错误信息
    if (res.error.message) {
      // 当 moreInfo 存在且内容不过长时拼接
      errorMessage =
        res.error.moreInfo && res.error.moreInfo.length < 50
          ? `${res.error.message}, ${res.error.moreInfo}`
          : res.error.message;
    }
    message(errorMessage, { type: "error", showClose: true });
    throw new Error(JSON.stringify(res.error));
  }

  /**
   * 后端返回 401 时，确认重新登录
   */
  private async confirmReLogin(res: any) {
    if (PureHttp.IS_CONFIRMING_RE_LOGIN) {
      return;
    }
    PureHttp.IS_CONFIRMING_RE_LOGIN = true;
    return ElMessageBox.confirm(
      `${transformI18n(res.error.message)}, ${transformI18n($t("login.reLoginConfirmContent"))}?`,
      `${transformI18n($t("login.reLoginConfirmTitle"))}`,
      {
        type: "warning",
        confirmButtonText: `${transformI18n($t("buttons.pureConfirm"))}`,
        cancelButtonText: `${transformI18n($t("buttons.pureClose"))}`
      }
    )
      .then(() => {
        removeToken();
        useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
        resetRouter();
        router.push({ name: "Login" });
        throw new Error(JSON.stringify(res.error));
      })
      .finally(() => {
        PureHttp.IS_CONFIRMING_RE_LOGIN = false;
      });
  }

  /** 通用请求工具函数 */
  public request<T, P = any>(config: PureHttpRequestConfig<P>): Promise<T> {
    return PureHttp.AXIOS_INSTANCE.request(config);
  }
}

export const http = new PureHttp();
