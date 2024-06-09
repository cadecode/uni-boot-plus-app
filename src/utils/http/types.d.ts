import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

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

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean;
  response?: PureHttpResponse;
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}

export interface PureHttpRequestConfig<P = any> extends AxiosRequestConfig<P> {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => any;
  beforeResponseCallback?: (
    response: PureHttpResponse,
    error?: PureHttpError
  ) => any;
}

export interface BasePureHttp {
  request<T, P>(config: PureHttpRequestConfig<P>): Promise<T>;
}
