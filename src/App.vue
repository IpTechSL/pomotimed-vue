<script setup>
import { RouterView } from 'vue-router'
import Header from '/src/components/includes/header.vue'
import Footer from '/src/components/includes/footer.vue'
import { ref } from 'vue';
import axios from 'axios';

let globalLang = ref('en');
async function getToken() {
    axios({
        method: "GET",
        url: "https://drupal.pomotimed.com/session/token"
    })
    .then(response => sessionStorage.setItem("token", response.data));
}
sessionStorage.getItem("token") ? false : getToken();


</script>

<template>

    <Header @lang="globalLang = $event.value" />
  
    <RouterView :lang="globalLang"/>
  
    <Footer />

</template>