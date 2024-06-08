import type {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";

/**
 * 统一响应接口
 */
export interface ApiResult<T = any> {
  /**
   * 与 http 状态码保持一致
   */
  status: number;
  /**
   * 数据
   */
  data?: T;
  /**
   * 异常信息
   */
  error?: ErrorMessage;
}

/**
 * 异常信息接口
 */
export interface ErrorMessage {
  /**
   * 错误码
   */
  code: string;
  /**
   * 错误信息
   */
  message?: string;
  /**
   * 路径
   */
  path?: string;
  /**
   * 更多错误信息
   */
  moreInfo?: string;
}

export type RequestMethods = Extract<
  Method,
  "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void;
  beforeResponseCallback?: (response: PureHttpResponse) => void;
}

export default class PureHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T>;
  post<T, P>(
    url: string,
    params?: P,
    config?: PureHttpRequestConfig
  ): Promise<T>;
  get<T, P>(
    url: string,
    params?: P,
    config?: PureHttpRequestConfig
  ): Promise<T>;
}
