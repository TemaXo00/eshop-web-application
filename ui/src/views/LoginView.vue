<template>
  <div class="login-page">
    <h2>Login</h2>

    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
    </div>

    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input
            id="email"
            v-model="loginData.email"
            type="email"
            required
            placeholder="Enter your email"
        />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
            id="password"
            v-model="loginData.password"
            type="password"
            required
            placeholder="Enter your password"
        />
      </div>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginDto } from '@/types/auth.type';

useRouter();
const authStore = useAuthStore();

const loginData = ref<LoginDto>({
  email: '',
  password: '',
});

const handleLogin = async () => {
  const result = await authStore.login(loginData.value);
  if (result.success) {
    console.log('Login successful');
  }
};
</script>