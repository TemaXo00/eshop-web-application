<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>

      <template v-if="authStore.isAuthenticated">
        <button @click="handleLogout">Logout</button>
        <router-link to="/test">Test Backend (Authorized only)</router-link>
      </template>

      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </nav>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
};
</script>