import Cookies from "js-cookie";
import { storageLocal } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  groupId: string;
  status: boolean;
  avatar?: string;
  sex?: string;
  mail?: string;
  phone?: string;
  loginIp?: string;
  loginDate?: string;
  tokenInfo: TokenInfo;
  roles?: Array<string>;
  permissions?: Array<string>;
}

/**
 * token 信息
 */
export interface TokenInfo {
  tokenName: string;
  tokenValue: string;
  isLogin: string;
  loginId: string;
  loginType: string;
  tokenTimeout?: string;
  sessionTimeout?: string;
  tokenSessionTimeout?: string;
  tokenActiveTimeout?: string;
  loginDevice?: string;
  tag?: string;
}

export const userKey = "user-info";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，</del>
 * 再次打开浏览器需要重新登录系统
 * <p/>
 * token header/cookie key，由后端控制其生命周期
 *
 * */
export const multipleTabsKey = "ubp-token";

/** 获取`token` */
export function getToken(): string {
  return (
    Cookies.get(multipleTabsKey) ||
    storageLocal().getItem<UserInfo>(userKey)?.tokenInfo?.tokenValue
  );
}

/**
 * 设置 token
 */
export function setToken(userInfo: UserInfo) {
  // token cookie 由后端控制生命周期，当 cookie 不存在时前端再写入
  const token = Cookies.get(multipleTabsKey);
  if (!token) {
    Cookies.set(multipleTabsKey, userInfo.tokenInfo?.tokenValue);
  }
  // 写入 localstorage
  storageLocal().setItem(userKey, userInfo);
  // 批量修改 store state
  useUserStoreHook().$patch(userInfo);
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token */
export const formatToken = (token: string): string => {
  return token;
  // return "Bearer " + token;
};
