import { defineStore } from "pinia";
import {
  resetRouter,
  router,
  routerArrays,
  storageLocal,
  store,
  type userType
} from "../utils";
import { getLogin } from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { removeToken, setToken, type UserInfo, userKey } from "@/utils/auth";

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
    async loginByUsername(data) {
      return new Promise<UserInfo>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            setToken(data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出 */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
