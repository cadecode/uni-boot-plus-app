<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "Welcome"
});

const username = useUserStoreHook()?.username;
const nickname = useUserStoreHook()?.nickname;
</script>

<template>
  <div>
    <el-card class="mb-4 box-card" shadow="never">
      <span>欢迎登录！当前用户：{{ username }}（{{ nickname }}）</span>
    </el-card>
  </div>
</template>
