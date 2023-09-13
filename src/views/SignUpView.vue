<script setup>
import axios from 'axios';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { onBeforeMount, ref, inject } from 'vue';


// Variables
const route = useRoute();
const user = route.params.user;
const router = useRouter();
const token = sessionStorage.getItem('token');

// User Variables
let userData = ref({
    username: ref(''),
    email: ref(''),
    password: ref(''),
    checkPerms: ref(false),
    validUser: ref(false)
});

// Status variables

let errorOnSign = ref(false);
let showStatus = ref(false);

// Validate Fields.
function validateFields() {
    if(userData.value.username.length > 0 && userData.value.email.length > 0 && userData.value.password.length > 0 && userData.value.checkPerms == true ) {
        userData.value.validUser = true;
    } else {
        userData.value.validUser = false;
    }
}

// Create user function
async function signUser() {
    userData.value.validUser = false;
    await axios({
        method: "POST",
        url: "https://drupal.pomotimed.com/pomotimed/user",
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            username: username.value,
            email: email.value,
            pass: password.value
        }
    })
    .then(response => {
        showStatus.value = true;
        if(response.status === 201) {
            errorOnSign.value = false;
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } else {
            errorOnSign.value = true;
        }
    })
    .catch((error) => {
        showStatus.value = true;
        errorOnSign.value = true;

        setTimeout(() => {
            showStatus.value = false;
        }, 3000);
    })

}


onBeforeMount(async () => {
    getTranslates();
})

// Get Translations.
const lang = inject("lang");
let translations = ref();
async function getTranslates() {
    await axios({
        method: "GET",
        url: "/services/loginsign.json"
    })
    .then(response => translations.value = response.data);
}

</script>
<template>
    <main>
        <div v-if="showStatus" class="status" :class="errorOnSign ? 'error' : 'success'">
            <p>{{ errorOnSign ? translations?.signerror?.[lang] : translations?.signsuccess?.[lang] }}</p>
        </div>
        <form v-if="translations" @submit.prevent="signUser()">
            <fieldset>
                <label for="username">{{ translations?.username?.[lang] }} <span>*</span></label>
                <input type="text" name="username" id="username" :placeholder="translations?.username?.[lang] " autocomplete="off" v-model="userData.username" v-on:input="validateFields()">
            </fieldset>
            <fieldset>
                <label for="email">{{ translations?.email?.[lang] }} <span>*</span></label>
                <input type="email" name="email" id="email" :placeholder="translations?.email?.[lang] " autocomplete="off" v-model="userData.email" v-on:input="validateFields()">
            </fieldset>
            <fieldset>
                <label for="password">{{ translations?.password?.[lang] }} <span>*</span></label>
                <input type="password" name="password" id="password" :placeholder="translations?.password?.[lang] " v-model="userData.password" v-on:input="validateFields()">
            </fieldset>
            <fieldset class="permsField">
                <div class="permsField-checkbox">
                    <input type="checkbox" name="perms" id="perms" v-model="userData.checkPerms" v-on:change="validateFields()" required>
                    <span class="permsField-span"></span>
                </div>
                <label for="perms" class="termsText" v-html="translations?.terms?.[lang]">
                </label>
            </fieldset>
            <input type="submit" :value="translations?.sign?.[lang]" :disabled="!userData.validUser">
        </form>
        <div class="links-helpers">
            <RouterLink to="/">
                {{ translations?.helper_forgot?.[lang] }}
            </RouterLink>            
            <RouterLink :to="{name: 'login'}">
                {{ translations?.login?.[lang] }}
            </RouterLink>            
        </div>
    </main>
</template>

<style scoped>

main {
    width: 90%;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: center;
    justify-content: center;
}

form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 60%;
    max-width: 25rem;
    margin-top: 1rem;
}

form fieldset {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
}

form fieldset label {
    text-align: center;
    color: var(--darkBlueText);
}

form fieldset label span {
    color: var(--lightRed);
}

form fieldset input {
    border: none;
    background-color: transparent;
    border-bottom: 2px solid #EA473B;
    color: #2c3e50;
}

form fieldset input::placeholder {
    font-weight: bold;
}

form fieldset input:focus-within,
form fieldset input:focus-visible {
    outline: rgba(212, 84, 84, 0.5) solid 1px;
    outline-offset: .25rem;
}


form input[type=submit] {
    cursor: pointer;
    padding: .5rem;
    place-self: center;
    color: var(--darkBlueText);
    border: none;
    background: #FF7F75;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    font-size: 1rem;
    transition: all .1s ease-in-out;
}

form input[type=submit]:disabled {
    opacity: .7;
    scale: .98;
    cursor: not-allowed;
}

.permsField {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.permsField input {
    opacity: 0;
}

.permsField > * {
    width: fit-content;
}

.permsField-checkbox {
    position: relative;
}

.permsField-checkbox span {
    border-radius: 3px;
    outline: 1px solid var(--darkBlueText);
    outline-offset: .15rem;
    height: 14px;
    width: 14px;
    position: relative;
    transition: all .15s ease;
    display: block;
}
.permsField-checkbox input:checked ~ .permsField-span {
    background-color: #2c3e50;
    outline-offset: 0;
    width: 16px;
    height: 16px;
}

.permsField-checkbox .permsField-span::after {
    content: "";
    position: absolute;
    display: none;
}

.permsField-checkbox input:checked ~ .permsField-span::after {
    display: inline-block;
    left: 35%;
    transform: rotate(45deg);
    height: 14px;
    width: 7px;
    border-bottom: 3px solid red;
    border-right: 3px solid red;
}

.permsField input[type=checkbox] {
    position: absolute;
    inset: 0;
    z-index: 2;
}

.permsField label {
    color: var(--darkBlueHF);
    font-size: .7rem;
}

.links-helpers {
    display: flex;
    justify-content: space-between;
    width: 90%;
    max-width: 25rem;
    gap: 0.35rem;
}

.links-helpers a {
    color: var(--darkBlueText);
    text-decoration: none;
}

.status {
    border-radius: 5px;
    padding: 1rem;
    outline-offset: -.2rem;
    outline-color: var(--lightWhite);
    outline-style: solid;
    outline-width: 2px;
    color: var(--darkBlueText);
}

.error {
    background-color: var(--lightRed);
}

.success {
    background-color: rgb(129, 199, 25);
}

html[data-theme=dark] .error {
    color: var(--lightWhite);
    outline-color: var(--darkGrey);
}

html[data-theme=dark] .success {
    outline-color: var(--darkGrey);
}

html[data-theme=dark] form fieldset label {
    color: var(--lightWhite);
}

html[data-theme=dark] form fieldset input {
    color: var(--lightWhite);
    border-color: var(--lightBlue);
}

html[data-theme=dark] .permsField label a {
    color: var(--lightBlue);
}

html[data-theme=dark] .permsField-checkbox span {
    outline-color: var(--lightRed);
}

html[data-theme=dark] .permsField-checkbox input:checked ~ .permsField-span  {
    background-color: var(--lightWhite);
    outline-color: var(--lightWhite);
}

html[data-theme=dark] .permsField-checkbox input:checked ~ .permsField-span::after  {
    border-bottom-color: var(--darkBlueText);
    border-right-color: var(--darkBlueText);
}

html[data-theme=dark] form fieldset input:focus-within,
html[data-theme=dark] form fieldset input:focus-visible {
    outline: rgba(71, 179, 255, 0.264) solid 1px;
    outline-offset: .25rem;
}

html[data-theme=dark] form input[type=submit] {
    background-color: var(--darkBlueHF);
    color: var(--lightWhite);
}

html[data-theme=dark] .links-helpers a {
    color: var(--lightWhite);
}

</style>

<style>
.termsText a {
    color: var(--darkBlueHF);
}

html[data-theme=dark] .termsText a {
    color: var(--lightWhite);
}
</style>