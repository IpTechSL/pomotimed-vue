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
        url: "/services/faq.json"
    })
    .then(response => translations.value = response.data);
}
</script>

<template>
    <main>
        <div class="question">
            <h2>{{ translations?.question1_title?.[lang] }}</h2>
            <p v-html="translations?.question1_desc?.[lang]"></p>
        </div>

        <div class="question">
            <h2>{{ translations?.question2_title?.[lang] }}</h2>
            <p v-html="translations?.question2_desc?.[lang]"></p>
        </div>

        <div class="question">
            <h2>{{ translations?.question3_title?.[lang] }}</h2>
            <p v-html="translations?.question3_desc?.[lang]"></p>
        </div>

        <div class="question">
            <h2>{{ translations?.question4_title?.[lang] }}</h2>
            <p v-html="translations?.question4_desc?.[lang]"></p>
        </div>
    </main>

</template>

<style scoped>

    main {
        width: 90%;
        margin: 2rem auto;
    }

    .question {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        color: var(--darkBlueText);
        margin: 1rem 0;
    }

    .question h2 {
        width: fit-content;
        font-weight: bold;
        border-bottom: 2px solid var(--lightRed);
        font-size: 1.2rem;
    }

    @media screen and (min-width: 780px) {
        
        main {
            width: 60%;
        }
        .question h2 {
            font-size: 1.4rem;
        }
    }

    html[data-theme=dark] .question {
        color: var(--lightWhite);
    }

    html[data-theme=dark] .question h2 {
        border-color: var(--lightBlue);
    }

</style>