<script setup>
import { onBeforeMount, toRefs, ref } from 'vue';
import axios from 'axios';

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
        url: "/services/projects_dashboard.json"
    })
    .then(response => translations.value = response.data);
}
</script>
<template>
    <main>
        <div class="head">
            <h1>{{ translations?.title?.[lang] }}</h1>
        </div>


        <div class="body">
            <RouterLink to="/projects/add">
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

</style>