<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DefaultLayout'
})
</script>

<template>
  <div>
    <div class="global-styles">
      <Nuxt />
    </div>
  </div>
</template>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

/* グローバルなリセットスタイル */
* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}
</style>