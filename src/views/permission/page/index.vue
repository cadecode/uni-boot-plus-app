<script setup lang="ts">
import { computed, type CSSProperties, ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "PermissionPage"
});

const elStyle = computed((): CSSProperties => {
  return {
    width: "85vw",
    justifyContent: "start"
  };
});

const roles = ref(useUserStoreHook()?.roles);
</script>

<template>
  <div>
    <p class="mb-2">
      模拟后台根据不同角色返回对应路由，观察左侧菜单变化（管理员角色可查看系统管理菜单、普通角色不可查看系统管理菜单）
    </p>
    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">
          <span>当前角色：{{ roles }}</span>
        </div>
      </template>
    </el-card>
  </div>
</template>
