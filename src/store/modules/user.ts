import { defineStore } from "pinia";
import { storageLocal, store, type userType } from "../utils";
import { setToken, type UserInfo, userKey } from "@/utils/auth";
import { loginByUsername, logout } from "@/api/auth";

const STORAGE_KEY_REMEMBER_ME = "remember-me";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => {
    const userInfo = storageLocal().getItem<UserInfo>(userKey);
    return {
      id: userInfo?.id,
      username: userInfo?.username,
      nickname: userInfo?.nickname,
      groupId: userInfo?.groupId,
      status: userInfo?.status,
      avatar: userInfo?.avatar,
      sex: userInfo?.sex,
      mail: userInfo?.mail,
      phone: userInfo?.phone,
      loginIp: userInfo?.loginIp,
      loginDate: userInfo?.loginDate,
      tokenInfo: userInfo?.tokenInfo,
      roles: userInfo?.roles ?? [],
      permissions: userInfo?.permissions ?? [],

      currentPage: 0,
      rememberMe:
        storageLocal().getItem<boolean>(STORAGE_KEY_REMEMBER_ME) ?? false
    };
  },
  actions: {
    /** 存储登录页面显示哪个组件 */
    SET_CURRENT_PAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_REMEMBER_ME(bool: boolean) {
      this.rememberMe = bool;
      storageLocal().setItem(STORAGE_KEY_REMEMBER_ME, bool);
    },
    /** 登入 */
    async loginByUsername(data: object) {
      return loginByUsername(data).then(res => {
        setToken(res.data);
        return res.data;
      });
    },
    /** 登出 */
    logout() {
      return logout();
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
