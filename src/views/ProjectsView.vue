<script setup>
import { onBeforeMount, toRefs, ref, inject, watch, provide } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import Modals from '../components/modals/modals.vue'

onBeforeMount(async () => {
    await getTranslates();
    getProjects();
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

// Get user.
const route = useRoute();
let user = ref(route.params.user);

watch(route, async () => {
    user.value = route.params.user;
})

// Get projects.
let projects = ref();
const jwt = localStorage.getItem('jwt');
function getProjects() {
    axios({
        method: "GET",
        url: `https://drupal.pomotimed.com/pomotimed/project/user/${user.value.uid}`
    })
    .then(response => {
        projects.value = response.data;
    })
    .catch(error => {
        console.log(error);
    })
}

// Tests warnings
const { showGlobalWarning } = inject('warning');

// Toggle Project view
function toggleProjectView(event) {
    const index = event.target.dataset.index;
    const projects = document.querySelectorAll(".project");
    const targeted = projects[index];
    targeted.classList.toggle("project-open");
}

// Options 
function activeOptions(event) {
    const index = event.target.dataset.index;
    const allOptions = document.querySelectorAll(".project-body-options-menu");
    const targeted = allOptions[index];
    event.target.classList.toggle("project-body-options-menu-active-button");
    targeted.classList.toggle("project-body-options-menu-active");
}

// Modals options
const showModals = ref(false);
const projectId = ref();
const typeOfModal = ref();

provide("showModal", {
    setShowModal
})

function setShowModal(value) {
    console.log("Desde invite");
    showModals.value = value;
}

function showModal(type, event) {
    typeOfModal.value = type;
    projectId.value = event.target.dataset.id;
    showModals.value = true;
}
</script>
<template>
    <Modals v-if="showModals" :type="typeOfModal" :projectId="projectId" />
    <main>
        <div class="head">
            <h1>{{ translations?.title?.[lang] }}</h1>
        </div>


        <div class="body">
            <RouterLink to="/projects/new">
                <button>{{ translations?.add_project?.[lang] }}</button>
            </RouterLink>
            <div class="projects-holder">

                <div class="project" v-for="(project, index) in projects">
                    <div class="project-head">
                        <a href="#">
                            <img src="/icons/external.svg" alt="External link Icon">
                        </a>
                        <h2 :data-index="index" @click="toggleProjectView($event)">{{ project.title }}</h2>
                        <button :data-index="index" @click="toggleProjectView($event)">
                            <img :data-index="index" src="/icons/arrow.svg" alt="Arrow Icon">
                        </button>
                    </div>

                    <div class="project-body">
                        <div class="project-body-state">
                            <h3>{{ translations?.state?.[lang] }}</h3>
                            <div class="project-body-state-nums">
                                <p>{{ project.completed_tasks }} <span>/</span> {{ project.total_tasks }} <span>({{ project.completed_tasks / project.total_tasks * 100 }}%)</span></p>
                            </div>
                        </div>
                        <div class="project-body-members">
                            <h3>{{ translations?.members?.[lang] }}</h3>
                            <div class="project-body-members-holder">
                                <div class="project-body-members-member">
                                    <span>
                                        <p>poladri11</p>
                                    </span>
                                    <img width="50" height="50" src="https://media.gettyimages.com/id/1602420601/es/foto/pink-and-bluish-glow-from-a-falcon-9-rocket-launch.jpg?s=2048x2048&w=gi&k=20&c=6Wr6AvS2Ael8sHI-nFhGWVYI9oQ-pVzugNiL48yK3g8=" alt="Image">
                                </div>
                                <div class="project-body-members-member">
                                    <span>
                                        <p>Ismaelsv13</p>
                                    </span>
                                    <img width="50" height="50" src="https://media.gettyimages.com/id/1475391957/es/vector/gatos-grises-sobre-un-conjunto-de-fondo-beige.webp?s=612x612&w=gi&k=20&c=nMFI13jt3jPaUaG52GQIv1McW2BO0M-xPwito0ceLkA=" alt="Image">
                                </div>
                                <div class="project-body-members-member">
                                    <span>
                                        <p>Vultur</p>
                                    </span>
                                    <img width="50" height="50" src="https://media.gettyimages.com/id/1533790985/es/foto/cabello-moderno-foto-de-archivo.webp?s=612x612&w=gi&k=20&c=WW4Mx9Akj196Cmr4cfeKIBA-_JFtexOy_qmQOY8-kTA=" alt="Image">
                                </div>
                                <div class="project-body-members-member">
                                    <span>
                                        <p>Paco</p>
                                    </span>
                                    <img width="50" height="50" src="https://media.gettyimages.com/id/1409730005/es/foto/chef-cocinando-en-un-restaurante-y-quemando-la-comida.webp?s=612x612&w=gi&k=20&c=mpsnuTtP6I1XmxR9oV1a-eni9_5U-h2jeSPzspwfcHA=" alt="Image">
                                </div>
                                <div class="project-body-members-member">
                                    <span>
                                        <p>Vultur</p>
                                    </span>
                                    <img width="50" height="50" src="https://media.gettyimages.com/id/1533790985/es/foto/cabello-moderno-foto-de-archivo.webp?s=612x612&w=gi&k=20&c=WW4Mx9Akj196Cmr4cfeKIBA-_JFtexOy_qmQOY8-kTA=" alt="Image">
                                </div>
                            </div>
                        </div>
                        <div class="project-body-options">
                            <button :data-index="index" @click="activeOptions($event)">
                                <span></span>
                                <span></span>
                                <span></span>
                                <!-- <img :data-index="index" width="24" height="24" src="/icons/dots.svg" alt="Dots Icon for options"> -->
                            </button>
                            <div class="project-body-options-menu">
                                <ul>
                                    <li class="project-body-options-menu-general">
                                        <button>{{ translations?.edit?.[lang] }}</button>
                                    </li>
                                    <template v-if="project.ownerId == user.uid">
                                        <li class="project-body-options-menu-general">
                                            <button :data-id="project.nid" @click="showModal('invite', $event)">{{ translations?.invite?.[lang] }}</button>
                                        </li>
                                        <li class="project-body-options-menu-general">
                                            <button>{{ translations?.archive?.[lang] }}</button>
                                        </li>
                                        <li class="project-body-options-menu-remove">
                                            <button>{{ translations?.remove?.[lang] }}</button>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li class="project-body-options-menu-leave">
                                            <button>{{ translations?.leave?.[lang] }}</button>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
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

html[data-theme=dark] h1 {
    color: var(--lightWhite);
}

.body {
    margin: 0 auto;
    width: 90%;
}

@media screen and (min-width: 600px) {
    .body {
        width: 80%;
    }
}

@media screen and (min-width: 900px) {
    .body {
        width: 70%;
    }
}

@media screen and (min-width: 1200px) {
    .body {
        width: 50%;
    }
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

html[data-theme=dark] .body > a button {
    background-color: var(--darkBlueText);
    color: var(--lightWhite);
    border-color: var(--darkBlueHF);
}

/* Projects */
.projects-holder {
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.project-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #EF7264;
    padding: .5rem 1rem;
    border-radius: 5px;
    transition: all .5s;
    gap: 2rem;
}

html[data-theme=dark] .project-head {
    background-color: var(--darkBlue);
}

.project-head a {
    font-size: 0;
    position: relative;
}

.project-head a::after {
    content: '|';
    width: 2px;
    height: 200%;
    background-color: rgba(218, 218, 218, 0.29);
    display: block;
    position: absolute;
    right: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
}

html[data-theme=dark] .project-head a img {
    filter: invert(1);
}

html[data-theme=dark] .project-head a::after {
    background-color: rgba(128, 128, 128, 0.5);
}

.project-head h2 {
    font-size: 1rem;
    color: var(--darkBlueText);
    width: 100%;
    text-align: center;
}

html[data-theme=dark] .project-head h2 {
    color: var(--lightWhite);
}

.project-head button {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

html[data-theme=dark] .project-head button {
    filter: invert(1);
}

.project-open .project-head {
    border-radius: 5px 5px 0 0;
}

.project-open .project-body {
    max-height: 50rem;
    padding: .5rem 1rem;
}

.project-open .project-head button img {
    transform: rotate(180deg);
}

.project-body {
    display: flex;
    justify-content: space-between;
    background-color: #F48F83;
    border-radius: 0 0 5px 5px;
    position: relative;
    max-height: 0rem;
    overflow: hidden;
    transition: all .45s;
    padding: 0rem 1rem;
}

html[data-theme=dark] .project-body {
    background-color: var(--darkBlueHF);
}

.project-body > * {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

.project-body h3 {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1px;
    color: var(--darkBlueText);
}

html[data-theme=dark] .project-body h3 {
    color: var(--lightWhite);
}

.project-body-state-nums p {
    font-size: .8rem;
    color: var(--darkBlueText);
}

html[data-theme=dark] .project-body-state-nums p {
    color: var(--lightWhite);
}

.project-body-members-holder {
    display: flex;
    flex-wrap: wrap;
    gap: .25rem;
    max-width: 6rem;
}

.project-body-members-member {
    position: relative;
}

.project-body-members-member:hover span {
    display: block;
    opacity: 1;
    top: -1rem;
    visibility: visible;
}

.project-body-members-member span {
    top: 0rem;
    left: 50%;
    opacity: 0;
    position: absolute;
    z-index: 99;
    transition: all .55s;
    background-color: #EF7264;
    padding: .5rem;
    border-radius: 5px;
    border: 1px solid;
    font-size: .7rem;
    visibility: hidden;
    transform: translate(-50%, -50%);
    color: var(--darkBlueText);
}

html[data-theme=dark] .project-body-members-member span {
    background-color: var(--lightWhite);
}

.project-body-members-member img {
    border-radius: 100%;
    width: 28px;
    height: 28px;
    border: 1px solid var(--darkBlueText);
    object-fit: cover;
    transition: all .25s;
}

html[data-theme=dark] .project-body-members-member img {
    border-color: rgba(128, 128, 128, 0.5);
}

.project-body-members-member:hover img {
    scale: .95;
}

.project-body-options {
    display: flex;
    justify-content: center;
}

.project-body-options button {
    border: none;
    background-color: transparent;
    padding: 0;
    display: flex;
    cursor: pointer;
    gap: 0.25rem;
    transition: all .5s;
}

.project-body-options button span {
    transition: all .15s;
    font-size: 2rem;
    background-color: #d03928;
    width: 6px;
    height: 6px;
    border-radius: 100vw;
    pointer-events: none;
}

.project-body-options-menu {
    overflow: hidden;
    transition: all .75s;
    max-height: 30rem;
    top: 50%;
    visibility: hidden;
}

.project-body-options-menu-active {
    opacity: 1;
    visibility: visible;
}

.project-body-options-menu ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: .25rem;
    padding: 0rem;
    height: 0px;
    overflow: hidden;
    transition: all .75s ease;
}

.project-body-options-menu-active ul {
    height: 10rem;
}

.project-body-options-menu ul li {
    display: grid;
    place-items: center;
    border-radius: 2px;
    padding: .4rem;
    border: 1px solid rgba(60, 59, 59, 0.208);
}

html[data-theme=dark] .project-body-options-menu ul li {
    border-color: rgba(128, 128, 128, 0.5);
}
.project-body-options-menu ul li button {
    text-align: center;
    padding: .1rem;
    letter-spacing: 1px;
    font-size: .7rem;
    cursor: pointer;
}
.project-body-options-menu-active-button {
    gap: 1rem !important;
}

.project-body-options-menu-general {
    background-color: #dd6153;
    transition: all .25s;
}

html[data-theme=dark] .project-body-options-menu-general {
    background-color: var(--darkBlue);
}

.project-body-options-menu-general button {
    color: var(--darkBlueText);
    font-weight: bold;
    transition: all .25s;
}

html[data-theme=dark] .project-body-options-menu-general button {
    color: var(--lightWhite);
}

.project-body-options-menu-general:hover {
    background-color: #d54434;
}

html[data-theme=dark] .project-body-options-menu-general:hover {
    background-color: rgb(48, 91, 116);;
}


.project-body-options-menu-remove  {
    background-color: var(--darkBlueText);
    transition: all .25s;
}
.project-body-options-menu-remove button {
    color: red;
    font-weight: bold;
    transition: all .25s;
}

.project-body-options-menu-remove:hover {
    background-color: rgb(44, 44, 57)}

html[data-theme=dark] .project-body-options-menu-remove {
    background-color: var(--lightRed);
}

html[data-theme=dark] .project-body-options-menu-remove button {
    color: var(--darkBlueHF);
}

html[data-theme=dark] .project-body-options-menu-remove:hover {
    background-color: #e7311c;
}

</style>