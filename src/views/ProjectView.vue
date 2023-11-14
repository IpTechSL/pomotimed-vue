<script setup>
import { useRoute } from 'vue-router';
import { onBeforeMount, ref, inject } from 'vue';
import axios from 'axios';

const route = useRoute();
const projectID = route.params.projectID
const projectInfo = ref();

onBeforeMount(async () => {
    await getTranslates();
    axios({
        method: "GET",
        url: `https://drupal.pomotimed.com/pomotimed/project/${projectID}`
    })
    .then(response => {
        projectInfo.value = response.data;
        console.log(projectInfo.value)
    })
})

// Get Translations.
const lang = inject("lang");
let translations = ref();

async function getTranslates() {
    axios({
        method: "GET",
        url: "/services/project.json"
    })
    .then(response => {
        translations.value = response.data
    });
}

</script>
<template>
    <div v-if="projectInfo" class="project-holder">

        <h1>{{ projectInfo.title }}</h1>
        <div class="desc-holder">
            <p>{{ projectInfo.desc ?? translations?.nodesc[lang] }}</p>
        </div>

        <div class="members-holder">
            <div class="members-head">
                <h2>{{ translations?.members[lang] }}</h2>
                <button>
                    <img src="/icons/arrow.svg" alt="Arrow Icon">
                </button>
            </div>

            <div class="members-body">
                <ul>
                    <!-- <li class="project-body-members-member">
                        <span>
                            <p>{{ projectInfo.ownerdata.username }}</p>
                        </span>
                        <img width="64" height="64" :src="projectInfo.ownerdata.profile_picture ? projectInfo.ownerdata.profile_picture  : '/icons/placeholder-user.jpeg'" :alt="`Profile picture of ${projectInfo.ownerdata.username}`">
                    </li> -->
                    <li v-for="member in projectInfo.users">
                        <span>
                            <p>{{ member.username }}</p>
                        </span>
                        <img width="64" height="64" :src="member.profile_picture ? member.profile_picture  : '/icons/placeholder-user.jpeg'" :alt="`Profile picture of ${member.username}`">
                    </li>
                </ul>
            </div>
        </div>

        <div class="tasks-holder">
            <h2>{{ translations?.tasks[lang] }}</h2>
            <div class="tasks-types">
                <button class="button-type active">
                    <p>
                        {{ translations?.tasks_active[lang] }}
                    </p>
                </button>
                <button class="button-type">
                    <p>
                        {{ translations?.tasks_finished[lang] }}
                    </p>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>

.project-holder {
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: center;
    margin-top: 2rem;
    gap: 1rem;
}

h1 {
    color: var(--darkBlueText);
}

.desc-holder {
    background-color: var(--lightRed);
    width: 90%;
    margin: 0 auto;
    padding: .5rem;
    border-radius: 5px;
    color: var(--darkBlueText);
}

.members-holder {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.members-head {
    display: flex;
    background-color: var(--lightRed);
    margin: 0 auto;
    width: 90%;
    justify-content: center;
    padding: .25rem .5rem;
    border-radius: 5px;
    font-size: .8rem;
    color: var(--darkBlueText);
}

.members-head h2 {
    flex: 1;
    font-weight: bold;
    margin-left: 30px;
}

.members-head button {
    background-color: transparent;
    border: none;
}

.members-body ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    width: 80%;
}

.members-body ul li {
    width: fit-content;
    position: relative;
}

.members-body ul li:hover span {
    opacity: 1;
    visibility: visible;
    top: -15px;
}

.members-body ul li span {
    display: block;
    background-color: #e75d4e;
    position: absolute;
    visibility: hidden;
    opacity: 0;
    transition: all .25s;
    padding: .35rem;
    color: var(--darkBlueText);
    border-radius: 2px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

.members-body ul li img {
    border-radius: 100%;
    object-fit: cover;
    border: 2px solid var(--lightRed);
    transition: all .25s;
    width: 48px;
    height: 48px;
}

.tasks-holder {
    color: var(--darkBlueText);
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 90%;
    margin: 0 auto;
}

.tasks-holder h2 {
    font-weight: bold;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.363);
    padding-bottom: 1rem;
}

.tasks-types {
    display: flex;
    gap: 5rem;
    position: relative;
    padding: .25rem;
}

.tasks-types::after {
    content: '';
    background-color: rgba(0, 0, 0, 0.363);
    position: absolute;
    left: 50%;
    top: 50%;
    height: 100%;
    width: 1px;
    display: block;
    transform: translate(-50%, -50%);
}

.button-type {
    flex: 1;
    background-color: transparent;
    border: none;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.button-type p {
    color: var(--darkBlueText);
    font-size: 1rem;
    font-weight: bold;
    opacity: .5;
}

.active p {
    opacity: 1 !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.363);
}

</style>