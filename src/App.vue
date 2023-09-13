<script setup>
import { RouterView } from 'vue-router'
import Header from '/src/components/includes/header.vue'
import Footer from '/src/components/includes/footer.vue'
import { ref, provide } from 'vue';
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


// On submit warnings.
let showWarning = ref(false);
let hideRow = ref(false);
let type = ref();
let msg = ref();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showGlobalWarning(typeOfWarning, warningMessage) {
    if(showWarning.value) return;
    showWarning.value = true;
    type.value = typeOfWarning;
    msg.value = warningMessage;
    await delay(300);

    const warningHolder = document.querySelector("#warning-holder");
    warningHolder.classList.add("activeWarning");
    hideRow.value = true;

    await delay(5000);

    warningHolder.classList.remove("activeWarning");

    await delay(1000);

    showWarning.value = false;
    hideRow.value = false;
}

provide('warning', {
    showGlobalWarning
})

provide('lang', globalLang);

</script>

<template>

    <div v-if="showWarning" class="warning-holder" :class="type" id="warning-holder">
        <div class="warning" id="warning">
            <p>{{msg}}</p>
        </div>
        <span :class="hideRow ? 'hideRow' : ''"></span>
    </div>

    <Header @lang="globalLang = $event.value" />
  
    <RouterView :lang="globalLang"/>
  
    <Footer />

</template>

<style scoped>
.warning-holder {
    position: fixed;
    width: 100%;
    z-index: 99;
    font-weight: bold;
    bottom: -100%;
    border-bottom: 1px solid rgb(39, 39, 39);
    display: flex;
    flex-direction: column;
    text-align: center;
    transition: bottom 1s;
}

@media screen and (min-width: 900px) {
    .warning-holder {
        width: 20%;
        right: 2rem;
        border-radius: 5px;
        border: 1px solid;
    }
}

@media screen and (min-width: 1400px) {
    .warning-holder {
        width: 20%;
        right: 4rem;
        border-radius: 5px;
        border: 1px solid;
    }
}

.warning-holder p {
    padding: 1rem;
}

.warning-holder span {
    width: 100%;
    height: 5px;
    display: block;
    align-self: flex-end;
    transition: width 5s linear;
}


.error {
    background-color: rgb(187, 61, 61);
}

.success {
    background-color: rgb(72, 209, 104);
}

.warn {
    background-color: rgb(236, 189, 34);
}

.error span {
    background-color: rgb(255, 86, 86);
}

.success span {
    background-color: rgb(53, 150, 75);
}

.warn span {
    background-color: rgb(177, 142, 26);
}

.activeWarning {
    bottom: 0%;
}

@media screen and (min-width: 900px) {
    .activeWarning {
        bottom: 4rem;
    }
}

.hideRow {
    width: 0% !important;
}
</style>