<script setup>
import { onMounted } from 'vue'
import { initCity } from '@/enter/index.js'
onMounted(() => {
  // 初始化三維場景
  initCity()
})
</script>
<template>
  <canvas id="webgl">瀏覽器不支持canvas，請切換重試</canvas>
</template>
<style scoped lang="scss">

</style>
