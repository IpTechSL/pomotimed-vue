<script setup>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ref, watch, toRefs, onBeforeMount } from 'vue';

// User changes
const route = useRoute();
let user = ref(route.params.user);

watch(route, async () => {
    user.value = route.params.user;
})


onBeforeMount(async () => {
    await getTranslates();
})

// Get Translations.
const props = defineProps({
  lang: String
})
const { lang } = toRefs(props);

let translations = ref();

async function getTranslates() {
    axios({
        method: "GET",
        url: "/services/new_project.json"
    })
    .then(response => translations.value = response.data);
}

// Form fields
let titleInput = ref('');
let dateLimit = ref(null);
let desc = ref(null);

// Create project request status 
let status = ref({
    show: false,
    error: false,
    message: ""
});
let requested = ref(false);

// Create Project
function createProject(dateLimit) {
    requested.value = true;
    const jwt = localStorage.getItem('jwt');

    try {
        dateLimit = dateLimit ? Math.floor(new Date(dateLimit).getTime() / 1000) : null;
    } catch (error) {

    }

    axios({
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        method: "POST",
        url: "https://drupal.pomotimed.com/pomotimed/project",
        data: {
            "title": titleInput.value,
            "field_estimated_finish_date": dateLimit,
            "field_description": desc.value ? desc.value : null
        }
    })
    .then(response => {
        showStatus(response.status);
    })
    .catch(error => {
        showStatus(error.response.status);
    })
}

function showStatus(requestStatus) {

    switch (requestStatus) {
        case 200:
            status.value.message = translations.value.success[lang.value];
            status.value.show = true;
            setTimeout(() => {
                redirecting();
            }, 500);
            break;
        default:
            status.value.message = translations.value.error[lang.value];
            status.value.error = true;
            status.value.show = true;
            setTimeout(() => {
                redirecting();
            }, 500);
            break;
    }
}

let timeLeft = ref(5);
const router = useRouter();

function redirecting() {
    
    const interval = setInterval(() => {
        timeLeft.value == 1 ? clearInterval(interval) : null;
        timeLeft.value == 1 ? router.push('/projects') : null; 
        timeLeft.value-=1;
    }, 1000);
}

</script>
<template>
    <main>
        <h1>{{ titleInput ? titleInput : translations?.title?.[lang] }}</h1>
        <p class="status" v-if="status.show" :class="status.error ? 'error' : 'success'">{{ status.message }}</p>
        <p class="status" v-if="status.show" :class="status.error ? 'error' : 'success'">{{ translations?.redirect?.[lang] }} {{ timeLeft }}</p>
        <form @submit.prevent="createProject(dateLimit)">
            <fieldset>
                <input type="text" name="name" id="name" v-model="titleInput" required autocomplete="off">
                <label for="name">{{ translations?.name?.[lang] }}</label>
            </fieldset>
            <fieldset>
                <label for="end">{{ translations?.time_limit?.[lang] }}</label>
                <input type="date" name="end" id="end" v-model="dateLimit">
            </fieldset>
            <fieldset>
                <label for="desc">{{ translations?.desc?.[lang] }}</label>
                <textarea name="desc" id="desc" cols="30" rows="7" spellcheck="off" v-model="desc"></textarea>
            </fieldset>
            <p class="optional"><span>*</span> {{ translations?.optional?.[lang] }}</p>
            
            <input :disabled="requested" type="submit" :value="!requested ? translations?.create?.[lang] + ' ' + titleInput : translations?.creating?.[lang]">
        </form>
    </main>
</template>

<style scoped>

main {
    width: 90%;
    margin: 2rem auto;
}

h1 {
    color: var(--darkBlueText);
    text-align: center;
    font-weight: bold;
    margin-bottom: 2rem;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    position: relative;
}

form fieldset label {
    color: var(--darkBlueText);
}

form *::selection {
    color: var(--lightWhite);
    background-color: var(--lightRed);
}

form input[type=submit],
form fieldset:nth-child(2) input {
    letter-spacing: 1px;
}
/* Name */

form fieldset:nth-child(1) {
    position: relative;
}

form fieldset:nth-child(1)::before {
    content: "*";
    position: absolute;
    left: 5px;
    color: var(--lightRed);
}

form fieldset:nth-child(1) input {
    background-color: transparent;
    border: none;
    border-bottom: 3px solid var(--lightRed);
    width: 100%;
}

form fieldset:nth-child(1) label {
    position: absolute;
    left: 1rem;
    bottom: .6rem;
    transition: all .25s;
}

form fieldset input:focus-within,
form fieldset input:focus-visible,
form fieldset textarea:focus-within,
form fieldset textarea:focus-visible {
    outline: rgba(212, 84, 84, 0.5) solid 1px;
    outline-offset: .25rem;
}

form fieldset:nth-child(1) input:focus ~ label,
form fieldset:nth-child(1) input:valid ~ label {
    font-size: .9rem;
    bottom: 2.2rem;
    opacity: .8;
}

/* Time limit */

form fieldset:nth-child(2) {
    display: flex;
    justify-content: space-evenly;
}

form fieldset:nth-child(2) input {
    background-color: var(--lightRed);
    border: none;
    padding: .35rem;
    border-radius: 4px;
    font-weight: 600;
    color: var(--darkBlueText);
    box-shadow: 0px 0px 7px 4px rgba(255, 101, 84, 0.5);
}

/* Desc */

form fieldset:nth-child(3) {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    align-items: center;
    color: var(--darkBlueText);
}

form fieldset:nth-child(3) textarea {
    resize: none;
    width: 100%;
    color: var(--darkBlueText);
    border: none;
    border: 1px solid var(--lightRed);
    padding: .5rem;
    border-radius: 3px;
}

/* Submit button */

form input[type=submit] {
    align-self: center;
    background-color: var(--lightRed);
    border: none;
    border: 1px solid rgba(69, 69, 69, 0.277);
    border-radius: 5px;
    padding: .5rem 1rem;
    color: var(--darkBlueText);
    font-weight: 600;
    max-width: 100%;
    box-shadow: 0px 0px 7px 4px rgba(255, 101, 84, 0.5);
    margin: 1rem 0;
    cursor: pointer;
}

form input[type=submit]:disabled {
    opacity: .75;
    scale: .95;
}


/* Optional class */
.optional {
    position: absolute;
    bottom: 4.5rem;
    left: 1rem;
    opacity: .75;
    font-size: .7rem;
}

.optional span {
    font-size: .9rem;
    color: var(--lightRed);
}

.status {
    margin: 1rem 0;
    text-align: center;
    padding: .25rem;
    border-radius: 3px;
}
.error {
    color: var(--lightWhite);
    background-color: var(--lightRed);
}

.success {
    color: var(--darkBlueText);
    background-color: rgb(129, 212, 3);
}

/* Dark mode */
html[data-theme=dark] h1,
html[data-theme=dark] form fieldset label,
html[data-theme=dark] form input,
html[data-theme=dark] form p {
    color: var(--lightWhite);
}

html[data-theme=dark] form fieldset:nth-child(1) input {
    border-color: var(--lightRed);
}

html[data-theme=dark] form fieldset:nth-child(2) input {
    background-color: var(--darkBlue);
    box-shadow: 0px 0px 7px 4px rgba(53, 74, 157, 0.333);
    color-scheme: dark;
}


html[data-theme=dark] form input[type=submit] {
    background-color: var(--darkBlue);
    box-shadow: 0px 0px 7px 4px rgba(53, 74, 157, 0.333);
}

html[data-theme=dark] form *::selection  {
    color: var(--lightWhite);
    background-color: var(--darkBlueText);
}

</style>