<script setup>
import { onBeforeMount, toRefs, ref } from 'vue';
import axios from 'axios';
import anime from 'animejs';

onBeforeMount(async () => {
    await getTranslates();
})

// Get props.
const props = defineProps({
  lang: String
})
const { lang } = toRefs(props);

let translations = ref();

async function getTranslates() {
    axios({
        method: "GET",
        url: "/services/projects_dashboard.json"
    })
    .then(response => translations.value = response.data);
}

// On submit warnings.
let showWarning = ref(false);
const errorOnSubmit = history.state.error;
const msgOnSubmit = history.state.msg;
let hideRow = ref(false);
console.log(history.state)

function WarningShow() {
    showWarning.value = true;
    setTimeout(() => {
        const warningHolder = document.querySelector("#warning-holder");
        warningHolder.classList.add("activeWarning");
        hideRow.value = true;

        setTimeout(() => {
            warningHolder.classList.remove("activeWarning");

            setTimeout(() => {
                showWarning.value = false;
            }, 1000);
        }, 6000);
    }, 300);
}

msgOnSubmit ? WarningShow() : null;

</script>
<template>
    <div class="warning-holder" :class="errorOnSubmit ? 'error' : 'success'" id="warning-holder">
        <div v-if="showWarning" class="warning" id="warning">
            <p v-if="msgOnSubmit">{{ msgOnSubmit }}</p>
        </div>
        <span :class="hideRow ? 'hideRow' : ''"></span>
    </div>
    <main>
        <div class="head">
            <h1>{{ translations?.title?.[lang] }}</h1>
        </div>


        <div class="body">
            <RouterLink to="/projects/new">
                <button>{{ translations?.add_project?.[lang] }}</button>
            </RouterLink>
            <div class="tasks-holder">

            </div>

        </div>
    </main>
</template>

<style scoped>

h1 {
    color: var(--darkBlueText);
    text-align: center;
    margin: 2rem 0;
    font-weight: bold;
}

.body {
    margin: 0 auto;
    width: 90%;
}

.body > a button {
    background-color: var(--lightRed);
    border: none;
    padding: .5rem 1rem;
    font-weight: bold;
    color: var(--darkBlueText);
    border-radius: 3px;
    font-size: 1rem;
    border: 1px solid var(--darkBlueText);
    cursor: pointer;
}

.warning-holder {
    position: fixed;
    width: 100%;
    z-index: 99;
    font-weight: bold;
    top: -100%;
    border-bottom: 1px solid rgb(39, 39, 39);
    display: flex;
    flex-direction: column;
    text-align: center;
    transition: top 1s;
}

.warning-holder p {
    padding: 1rem;
}

.warning-holder span {
    width: 100%;
    height: 5px;
    display: block;
    align-self: flex-end;
    transition: width 6s linear;
}


.error {
    background-color: rgb(187, 61, 61);
}

.success {
    background-color: rgb(72, 209, 104);
}

.error span {
    background-color: rgb(255, 86, 86);
}

.success span {
    background-color: rgb(53, 150, 75);

}

.activeWarning {
    top: 0%;
}

.hideRow {
    width: 0% !important;
}
</style>