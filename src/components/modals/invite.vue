<script setup>
import { onBeforeMount, ref, inject } from 'vue';
import axios from 'axios';


// Translations
const lang = inject("lang");
let translations = ref();

async function getTranslates() {
    axios({
        method: "GET",
        url: "/services/invite_modal.json"
    })
    .then(response => translations.value = response.data);
}

onBeforeMount(async () => {
    await getTranslates();
})

const { showGlobalWarning } = inject('warning');

// Invite the user.
const { setShowModal } = inject("showModal");
const projectId = inject("projectId");
const email = ref();

function sendInvite(email) {
    const jwt = localStorage.getItem('jwt');
    axios({
        method: "POST",
        url: "https://drupal.pomotimed.com/pomotimed/project/invite",
        data: {
            "user_email": email,
            "project_id": projectId
        },
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    })
    .then(response => {
        showWarning(response.status);
    })
    .catch(error => {
        showWarning(error.response.status);
    })
    setShowModal(false);
}

function showWarning(status) {
    switch (status) {
        case 200:
            showGlobalWarning("success", translations.value.success[lang.value]);
            break;
        case 405:
            showGlobalWarning("warn", translations.value.warn[lang.value]);
            break;
        default:
            console.log(translations.value);
            showGlobalWarning("error", translations.value.error[lang.value]);
            break;
    }
}

</script>
<template>
    <div class="invite-holder">
        <h2>{{ translations?.title[lang] }}</h2>
        <form @submit.prevent="sendInvite(email)">
            <fieldset>
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" autocomplete="off" spellcheck="false" v-model="email" required>
            </fieldset>
            <input type="submit" :value="translations?.submit?.[lang]" />

        </form>
    </div>
</template>

<style scoped>

.invite-holder {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

h2 {
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

fieldset {
    display: flex;
    gap: .25rem;
}

fieldset input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--darkBlue);
    color: var(--darkBlueText);
    font-weight: bold;
    letter-spacing: 1px;
}

input[type=submit] {
    border: none;
    font-weight: bold;
    color: var(--darkBlueText);
    letter-spacing: 1px;
    background-color: var(--lightRed);
    padding: .5rem;
    border-radius: 2px;
    width: fit-content;
    align-self: center;
    border: 1px solid rgba(128, 128, 128, 0.455);
}

</style>