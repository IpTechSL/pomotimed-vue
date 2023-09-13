<script setup>
import { inject, onBeforeMount, ref } from 'vue';
import axios from 'axios';

// Tasks. 
var localSto = JSON.parse(localStorage.getItem("tasks"));
if(localSto == null) {
    localSto = [];
}

let taskList = ref(localSto);
let showAdd = ref(false);
let taskDescHolder = ref("");
let showError = ref(false);

function cancelAddTask() {
    showAdd.value = false;
    taskDescHolder.value = "";
    document.body.classList.remove('tasks-add-blur');
    showError.value = false;
}

function closeOnClickOut(event) {
    if(event.target.id === "app") {
        cancelAddTask();
        document.removeEventListener("click", closeOnClickOut);
    }
}

function showAddMenu() {
    showAdd.value = true; 
    document.body.classList.add('tasks-add-blur');
    document.addEventListener("click", closeOnClickOut)
}

function addTask() {
    if(taskDescHolder.value.length < 1) {
        isEmptyWarning();
        return
    }
    taskList.value.push(taskDescHolder.value);
    taskDescHolder.value = "";
    showAdd.value = false;
    localStorage.setItem("tasks", JSON.stringify(taskList.value));
    showError.value = false;
    document.body.classList.remove('tasks-add-blur');
    document.removeEventListener("click", closeOnClickOut);
}

function deleteTask(event) {

    if(event.target.src != window.location.href + 'icons/tick.svg') {
        event.target.src = '/icons/tick.svg';
    } else {
        taskList.value.splice(event.target.dataset.id, 1);
        localStorage.setItem("tasks", JSON.stringify(taskList.value))
        event.target.src = '/icons/cross.svg';
    }
}

function isEmptyWarning() {
    showError.value = true;
}


// Translations. 
onBeforeMount(() => {
    getTranslates();
})

const lang = inject("lang");
let tasksLanguages = ref();
async function getTranslates() {
    await axios({
        method: "GET",
        url: "/services/tasks.json"
    })
    .then(response => tasksLanguages.value = response.data);
}
</script>
<template>
    <section class="tasks">
        <div v-if="showAdd" class="tasks-add">
            <h2>{{ tasksLanguages?.add?.[lang] }}</h2>
            <div class="tasks-add-info">
                <label for="addtask">{{ tasksLanguages?.description?.[lang] }}</label>
                <p class="task-add-info-error" v-if="showError">{{ tasksLanguages.empty[lang] }}</p>
                <textarea rows="5" name="addtask" id="addtask" v-model="taskDescHolder"></textarea>
            </div>

            <div class="tasks-add-actions">

                <button @click="cancelAddTask()">
                    <img src="/icons/cross.svg" alt="Cancel Icon">
                </button>

                <button @click="addTask()">
                    <img src="/icons/tick.svg" alt="Tick Icon">
                </button>
            </div>
        </div>

        <div v-if="tasksLanguages" class="tasks-head">
            <h1>{{ tasksLanguages?.title?.[lang] }}</h1>
            <button @click="showAddMenu()">{{ tasksLanguages?.add?.[lang] }}</button>
        </div>
        
        <div class="tasks-body">
            
            <div v-if="taskList.length == 0" class="task">
                <p>1.</p>
                <p>{{ tasksLanguages?.example?.[lang] }}</p>
            </div>

            <div v-for="(task, index) in taskList" :id="task.id" class="task">
                <p>{{index +1}}.</p>
                <p>{{task}}.</p>
                <img @click="deleteTask($event)" :data-id="index" src="/icons/cross.svg" alt="Delete Icon">
            </div>


        </div>

    </section>
</template>

<style>

.tasks-add {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 153, 153);
    border-radius: 5px;
    height: 50%;
    min-height: 20rem;
    max-height: 25rem;
    width: 90%;
    padding: 1rem;
    max-width: 30rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    justify-content: space-around;
    text-align: center;
    color: var(--darkBlueText);
    box-shadow: 0px 4px 12px 4px rgba(0, 0, 0, 0.25);
    z-index: 99;
}

.tasks-add-blur::before {
    content: '';
    inset: 0;
    background-color: rgba(206, 206, 206, 0.295);
    position: absolute;
    filter: blur(5px);
    z-index: 55;
}

.tasks-add-info {
    gap: .5rem;
    display: flex;
    flex-direction: column;
}

.task-add-info-error {
    background-color: var(--darkBlue);
    border-radius: 5px;
    color: var(--lightWhite);
}

.tasks-add-info textarea {
    padding: .4rem;
    border-radius: 5px;
    resize: none;
    background-color: var(--lightWhite);
    color: var(--darkBlueText);
    box-shadow: 0px 4px 12px 4px rgba(0, 0, 0, 0.25);
}

.tasks-add-info textarea:focus-visible {
    border: none;
    outline-color: var(--lightRed);
}

.tasks-add-info textarea::selection {
    color: var(--darkBlueText);
    background-color: var(--lightRed);
}

.tasks-add-actions {
    display: flex;
    justify-content: space-evenly;
}

.tasks-add-actions button {
    background-color: transparent;
    border: none;
    width: 44px;
    height: 44px;
    padding: 0;
}

.tasks-add-actions button:focus-within {
    outline-color: var(--lightWhite);
}

.tasks-add-actions img {
    width: 100%;
    background-color: var(--darkBlueText);
    border-radius: 5px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

html[data-theme=dark] .tasks-add {
    background-color: #202D39;
    box-shadow: 0px 0px 7px 4px rgba(147, 212, 197, 0.06);
}

html[data-theme=dark] .tasks-add {
    color: var(--lightWhite);
}

html[data-theme=dark] .tasks-add-info textarea {
    box-shadow: 0px 0px 7px 4px rgba(147, 212, 197, 0.06);
}

html[data-theme=dark] .task-add-info-error {
    background-color: var(--lightRed);
}

.tasks {
    width: 90%;
    margin: 0 auto;
    max-width: 50rem;
}

.tasks-head {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 2rem;
}
.tasks-head h1 {
    text-align: center;
    color: var(--darkBlueText);
    font-size: 1.8rem;
}

.tasks-head button {
    height: 100%;
    background-color: var(--lightRed);
    border: none;
    border-radius: 5px;
    box-shadow: 0px 4px 12px 4px rgba(0, 0, 0, 0.25);
    color: var(--darkBlueText);
    font-size: 1.2rem;
    cursor: pointer;
}

.tasks-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

html[data-theme=dark] .tasks-head h1,
html[data-theme=dark] .tasks-head button {
    color: var(--lightWhite);
}

html[data-theme=dark] .tasks-head button {
    background-color: var(--darkBlue);
}

html[data-theme=dark] .task {
    background-color: var(--darkBlue);
    box-shadow: 0px 0px 7px 4px rgba(147, 212, 197, 0.05);
}

html[data-theme=dark] .task img {
    background-color: #192129;
}

.task {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: var(--lightRed);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0px 0px 7px 4px rgba(169, 67, 56, 0.24);
}

.task p {
    background-color: rgba(255, 255, 237, 0.43);
    white-space: pre-line;
    color: var(--darkBlueText);
    padding: .5rem;
    word-break: break-word;
    border-radius: 5px;
    box-shadow: 0px 4px 12px 4px rgba(0, 0, 0, 0.25);
}

.task p:nth-child(2) {
    flex: 1;
}

.task img {
    width: 32px;
    background-color: var(--darkBlueText);
    border-radius: 5px;
    box-shadow: 0px 4px 12px 4px rgba(0, 0, 0, 0.25);
}

</style>