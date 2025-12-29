<template>
  <div class="home-page">
    <h2>Home Page</h2>

    <div v-if="authStore.isAuthenticated">
      <p>Welcome, {{ authStore.fullName }}!</p>
      <p>Email: {{ authStore.user?.email }}</p>
      <p>Role: {{ authStore.user?.role }}</p>
      <p>Status: {{ authStore.user?.status }}</p>

      <button @click="handleLogout">Logout</button>
    </div>

    <div v-else>
      <p>You are not logged in.</p>
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
};
</script>