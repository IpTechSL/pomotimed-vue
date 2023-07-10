<script setup>
import { RouterView } from 'vue-router'
import Header from '/src/components/includes/header.vue'
import Footer from '/src/components/includes/footer.vue'
import { ref } from 'vue';

let globalLang = ref('en');
</script>

<template>

  <Header @lang="globalLang = $event.value" />

  <RouterView :lang="globalLang"/>

  <Footer />
</template>

<style scoped>
</style>
