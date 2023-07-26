<script setup>
import axios from 'axios';
import { onBeforeMount, ref, toRefs } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
let user = ref(route.params.user);
const router = useRouter();
const token = sessionStorage.getItem('token');

async function login() {
    await axios({
        method: "POST",
        url: "https://drupal.pomotimed.com/pomotimed/login-check",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        data: {
            username: "admin",
            password: "admin"
        },
        auth: {
            username: "admin",
            password: "admin"
        }
    })
    .then(response => {
        if(response.status === 200) {
            localStorage.setItem("jwt", response.data.token);
            router.push('/')
        }
    })
    
}

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
        url: "/services/loginsign.json"
    })
    .then(response => translations.value = response.data);
}

</script>
<template>
    <main>
        <form v-if="translations" @submit.prevent="login()">
            <fieldset>
                <label for="email">{{ translations?.email?.[lang] }}</label>
                <input type="email" name="email" id="email" :placeholder="translations?.email?.[lang]" autocomplete="off">
            </fieldset>
            <fieldset>
                <label for="password">{{ translations?.password?.[lang] }}</label>
                <input type="password" name="password" id="password" :placeholder="translations?.password?.[lang] ">
            </fieldset>
            <input type="submit" :value="translations?.login?.[lang] ">
        </form>
        <div class="links-helpers">
            <RouterLink to="/">
                {{ translations?.helper_forgot?.[lang] }}
            </RouterLink>            
            <RouterLink :to="{name: 'sign up'}">
                {{ translations?.sign?.[lang] }}
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
    font-weight: bold;
    color: var(--darkBlueText);
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
    font-weight: bold;
    color: var(--darkBlueText);
    border: none;
    background: #FF7F75;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    font-size: 1rem;

}

.links-helpers {
    display: flex;
    justify-content: space-between;
    width: 90%;
    max-width: 25rem;
    gap: 0.35rem;
}

.links-helpers a {
    font-weight: bold;
    color: var(--darkBlueText);
    text-decoration: none;
}

html[data-theme=dark] form fieldset label {
    color: var(--lightWhite);
}

html[data-theme=dark] form fieldset input {
    color: var(--lightWhite);
    border-color: var(--lightBlue);
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