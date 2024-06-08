import { http } from "@/utils/http";
import type { UserInfo } from "@/utils/auth";

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserInfo>("post", "/login", { data });
};
