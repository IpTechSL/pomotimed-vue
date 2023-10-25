<script setup>
import { ref, inject, onMounted, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// Translations
const lang = inject("lang");
let translations = ref();


async function getTranslates() {
    axios({
        method: "GET",
        url: "/services/accept_invite.json"
    })
    .then(response => translations.value = response.data);
}

onBeforeMount(async () => {
    await getTranslates();
})

// Route
const route = useRoute();
const token = route.query.t;

// Accept invite

function acceptInvite() {

    const jwt = localStorage.getItem('jwt');
    axios({
        method: "GET",
        url: `https://drupal.pomotimed.com/pomotimed/project/validate/${token}`
    })
    .then(response => {
        setTimeout(() => {
            showWarn(response.status);
        }, 1000);
    })
    .catch(error => {
        setTimeout(() => {
            showWarn(error.response.status);
        }, 1000);
    })
}

// Show accept status
const { showGlobalWarning } = inject('warning');
const router = useRouter();

function showWarn(status) {
    switch (status) {
        case 200:
            showGlobalWarning('success', translations.value.success[lang.value])
            
            setTimeout(() => {
                router.push(
                    {
                        name: 'home', 
                    }
                )
            }, 400);
            break;
    
        default:
            showGlobalWarning('error', translations.value.error[lang.value]);
            
            setTimeout(() => {
                router.push(
                    {
                        name: 'home', 
                    }
                )
            }, 400);
            break;
    }
}

onMounted(() => {
    acceptInvite();
})

</script>
<template>
    <main>
        <h1>{{ translations?.title?.[lang] }}</h1>
        <div class="loader"></div>
    </main>
</template>

<style>

/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  border: 4px solid #0000;
  border-radius: 50%;
  border-color: #ccc #0000;
  animation: l16 1s infinite linear;
}
.loader::before,
.loader::after {    
  content: "";
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
}
.loader::before {
  border-color: #f03355 #0000;
  animation: inherit; 
  animation-duration: .5s;
  animation-direction: reverse;
}
.loader::after {
  margin: 8px;
}
@keyframes l16 { 
  100%{transform: rotate(1turn)}
}
</style>

<style scoped>

main {
    width: 90%;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

h1 {
    color: var(--darkBlueText);
}

html[data-theme=dark] h1 {
    color: var(--lightWhite);
}

</style>