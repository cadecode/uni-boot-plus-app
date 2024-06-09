import { defineStore } from "pinia";
import { storageLocal, store, type userType } from "../utils";
import { setToken, type UserInfo, userKey } from "@/utils/auth";
import { loginByUsername, logout } from "@/api/auth";

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
      permissions: userInfo?.permissions ?? []
    };
  },
  actions: {
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
