<script setup>
import { onBeforeMount, ref, inject } from 'vue';
import axios from 'axios';
import router from '../../router/index'


// Translations
const lang = inject("lang");
let translations = ref();

async function getTranslates() {
    axios({
        method: "GET",
        url: "/services/leave_modal.json"
    })
    .then(response => translations.value = response.data);
}

onBeforeMount(async () => {
    await getTranslates();
})

const { showGlobalWarning } = inject('warning');
const { setKeyToRefresh } = inject("setKey")

// Invite the user.
const { setShowModal } = inject("showModal");
const projectId = inject("projectId");


function leaveProject() {
    const jwt = localStorage.getItem('jwt');
    axios({
        method: "DELETE",
        url: `https://drupal.pomotimed.com/pomotimed/project/user/39/project/${projectId}`,
        data: {
            
        },
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    })
    .then(response => {
        showWarning(response.status);
    })
    .catch(error => {
        console.log(error);
        showWarning(error.response.status);
    })
    setShowModal(false);
}

function showWarning(status) {
    switch (status) {
        case 204:
                showGlobalWarning("success", translations.value.success[lang.value]);
                setTimeout(() => {
                    setKeyToRefresh();
                }, 300);
            break;
        default:
                showGlobalWarning("error", translations.value.error[lang.value]);
                setTimeout(() => {
                    setKeyToRefresh();
                }, 300);
            break;
    }
}

</script>

<template>

    <h1>{{ translations?.title?.[lang] }}</h1>

    <div>
        <button @click="leaveProject()">
            <img src="/icons/tick.svg" alt="Tick Icon">
        </button>
        <button @click="setShowModal(false)">
            <img src="/icons/cross.svg" alt="Tick Icon">
        </button>
    </div>
</template>

<style scoped>

div {
    display: flex;
    justify-content: space-around;
    margin-top: 2rem;
}

div button {
    border: none;
    border-radius: 2px;
    display: flex;
    align-items: center;
    background-color: var(--darkBlue);
    padding: 0;
    cursor: pointer;
}

html[data-theme=dark] div button {
    background-color: rgb(0, 0, 50);
}

img {
    width: 32px;;
    height: 32px;
}

</style>