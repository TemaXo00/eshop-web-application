<script lang="ts">
import api from "@/config/api.config.ts";

export default {
  data() {
    return {
      answer: {} as Record<string, any>,
    }
  },
  methods: {
    async getDbState() {
      try {
        const result = await api.get("/db-health");
        this.answer = result.data;
      } catch (error) {
        this.answer = {error};
      }
    },
    async getNestState() {
      try {
        const result = await api.get("/");
        this.answer = result.data;
      } catch (error) {
        this.answer = {error};
      }
    }
  }
}
</script>

<template>
  <h1 class="greeting">Welcome to Nest.js test UI</h1>
  <div class="greeting__buttons">
    <button @click="getNestState()" class="greeting-btn">Get Nest State</button>
    <button @click="getDbState()" class="greeting-btn">Get DB State</button>
  </div>
  <pre class="greeting__answer">{{ answer }}</pre>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.greeting {
  text-align: center;
  margin: 20px 0;
}

.greeting__buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 40px;
}

.greeting-btn {
  padding: 20px 40px;
  font-size: 20px;
  border-radius: 10px;
  border: 0;
}

.greeting__answer {
  margin: 20px;
  font-size: 20px;
}
</style>