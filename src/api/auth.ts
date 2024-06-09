import { http } from "@/utils/http";
import type { ApiResult } from "@/utils/http/types";
import type { UserInfo } from "@/utils/auth";

export const loginByUsername = (data: object) => {
  return http.request<ApiResult<UserInfo>>({
    method: "post",
    url: "/auth/login",
    data
  });
};

export const logout = () => {
  return http.request<ApiResult>({
    method: "get",
    url: "/auth/logout"
  });
};

export const getAsyncRoutes = () => {
  return http.request<ApiResult>({
    method: "get",
    url: "/auth/get_user_routes"
  });
};
