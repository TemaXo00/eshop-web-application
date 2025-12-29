<template>
  <div class="register-page">
    <h2>Register</h2>

    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
    </div>

    <form @submit.prevent="handleRegister">
      <div>
        <label for="first_name">First Name:</label>
        <input
            id="first_name"
            v-model="registerData.first_name"
            type="text"
            required
            placeholder="Enter your first name"
        />
      </div>

      <div>
        <label for="last_name">Last Name:</label>
        <input
            id="last_name"
            v-model="registerData.last_name"
            type="text"
            placeholder="Enter your last name"
        />
      </div>

      <div>
        <label for="email">Email:</label>
        <input
            id="email"
            v-model="registerData.email"
            type="email"
            required
            placeholder="Enter your email"
        />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
            id="password"
            v-model="registerData.password"
            type="password"
            required
            placeholder="Enter your password"
        />
      </div>

      <div>
        <label for="phone">Phone:</label>
        <input
            id="phone"
            v-model="registerData.phone"
            type="tel"
            required
            placeholder="Enter your phone number"
        />
      </div>

      <div>
        <label for="username">Username (optional):</label>
        <input
            id="username"
            v-model="registerData.username"
            type="text"
            placeholder="Choose a username"
        />
      </div>

      <div>
        <label for="avatar_url">Avatar URL (optional):</label>
        <input
            id="avatar_url"
            v-model="registerData.avatar_url"
            type="url"
            placeholder="Enter avatar URL"
        />
      </div>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>

    <div>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { RegisterDto } from '@/types/auth.type';

useRouter();
const authStore = useAuthStore();

const registerData = ref<RegisterDto>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  username: '',
  avatar_url: '',
});

const handleRegister = async () => {
  const result = await authStore.register(registerData.value);
  if (result.success) {
    console.log('Registration successful');
  }
};
</script>