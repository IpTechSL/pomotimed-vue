<script setup>

import Timer from 'easytimer.js';
import { ref, onBeforeMount, onMounted, toRefs, onBeforeUpdate } from 'vue';
import anime from 'animejs';
import axios from 'axios';
import { onBeforeRouteLeave } from 'vue-router';

// Variables definitions.
let minutes = ref(25);
let timeLeft = ref('25:00');
let isActive = ref(false);
let selectedMode = ref(1);
let configMins = {
    pomodoro: 25,
    short: 5,
    long: 15
}
let settingsState = ref(false);
let timer;

const props = defineProps({
    lang: String
});
const { lang } = toRefs(props);
// Chron state / generation.
function changeChronState() {
    if(isActive.value) {
        timer.pause();
    } else {
        timer.start();
    }
    isActive.value = !isActive.value;
}

function generateNewChron() {
    if(minutes.value > 60 || minutes.value < 1) return;
    isActive.value = false;
    try {
        timer.stop()
    } catch (error) {
    }
    timer = new Timer({countdown: true, startValues: {minutes: minutes.value}, target: {seconds: 0}});
    if(minutes.value === 60) {
        timeLeft.value = timer.getTimeValues().toString(['hours','minutes', 'seconds'])
    } else {
        timeLeft.value = timer.getTimeValues().toString(['minutes', 'seconds'])
    }
    timer.addEventListener("secondsUpdated", () => {
        timeLeft.value = timer.getTimeValues().toString(['minutes', 'seconds']);
    })
    
    timer.addEventListener("targetAchieved", () => {
        const alarm = new Audio("/sounds/alarm.mp3");
        alarm.play();
        isActive.value = false;
    })
}


// Change mode.
function changeMode(n, event) {
    
    selectedMode.value = n;
    switch (event.target.dataset.type) {
        case "1":
            minutes.value = configMins.pomodoro;
            generateNewChron();
            break;
        case "2":
            minutes.value = configMins.short;
            generateNewChron();
            break;
            
        case "3":
            minutes.value = configMins.long;
            generateNewChron();
            break;
        default:
            break;
        }
                modeAnim();
            }
            
// Apply changge settings.
function changeSettings() {
                
    if(configMins.pomodoro < 1) {configMins.pomodoro = 1} else if (configMins.pomodoro > 60) {configMins.pomodoro = 60}
    if(configMins.short < 1) {configMins.short = 1} else if (configMins.short > 60) {configMins.short = 60}
    if(configMins.long < 1) {configMins.long = 1} else if (configMins.long > 60) {configMins.long = 60}

    switch (document.querySelector(".selected").dataset.type) {
        case "1":
            minutes.value = configMins.pomodoro;
            generateNewChron();
            break;
        case "2":
            minutes.value = configMins.short;
            generateNewChron();
            break;
            
        case "3":
            minutes.value = configMins.long;
            generateNewChron();
            break;
        default:
            break;
    }
    settingsState.value = false;
}


// Animate line on the bottom of the selected mode.
function modeAnim(instant) {
    const timerContainer = document.querySelector(".pomodoro-timer-head");
    const underLineMode = document.querySelector(".modeLine");
    let duration = 250;
    if(instant) {
        duration = 0; 
    } 
    setTimeout(() => {
        const X = document.querySelector(".selected").getBoundingClientRect().left - timerContainer.getBoundingClientRect().left;
        const width = document.querySelector(".selected").getBoundingClientRect().width;
    
        
        anime({
            targets: underLineMode,
            width: width,
            left: X,
            duration: duration,
            easing: "easeInQuart"
        })
    }, 1);
}

onBeforeMount(async () => {
    await getTranslates();
    generateNewChron();
    modeAnim();
    window.addEventListener("resize", modeAnim);
})

onBeforeRouteLeave(() => {
    window.removeEventListener("resize", modeAnim);
})


function sound() {
    const audio = new Audio("/sounds/click.mp3");
    audio.play();
}


let timerLanguages = ref({ 
    "field_timer_state_start": { 
        "en": "Start", 
        "es": "Iniciar" 
    }, 
    "field_timer_state_stop": { 
        "en": "Pause", 
        "es": "Pausar" 
    }, 
    "field_pomodoro": { 
        "en": "Pomodoro", 
        "es": "Pomodoro" 
    }, 
    "field_long_break": { 
        "en": "Long break", 
        "es": "Descanso largo" 
    }, 
    "field_short_break": { 
        "en": "Short break", 
        "es": "Descanso corto" 
    }, 
    "field_settings_pomodoro": { 
        "en": "Pomodoro minutes", 
        "es": "Minutos de pomodoro" 
    }, 
    "field_settings_long": { 
        "en": "Long break minutes", 
        "es": "Minutos de descanso largo" 
    },
    "field_settings": {
        "en": "Settings",
        "es": "Ajustes"
    },
    "field_settings_short": { 
        "en": "Short break minutes", 
        "es": "Minutos de descanso corto" 
    }, "field_settings_max": {
         "en": "Maximum amount", 
         "es": "Cantidad máxima" }
    });
async function getTranslates() {
    await axios({
        method: "GET",
        url: "/services/Timer.json"
    })
    .then(response => timerLanguages.value = response.data);
}

onBeforeUpdate(() => {
    modeAnim();
})

</script>

<template>
    <div v-if="settingsState" class="pomodoro-timer-settings">
        <div class="pomodoro-timer-settings-head">
            <h2>{{ timerLanguages.field_settings[lang] }}</h2>
            <p>{{ timerLanguages.field_settings_max[lang] }}: 60</p>
        </div>
        <div class="pomodoro-timer-settings-body">
            <div class="setting-timer">
                <label for="pomodoro-minutes">{{ timerLanguages.field_settings_pomodoro[lang] }}</label>
                <input min="1" max="60" type="number" name="pomodoro-minutes" id="pomodoro-minutes" v-model="configMins.pomodoro">
            </div>
            <div class="setting-timer">
                <label for="small-minutes">{{ timerLanguages.field_settings_short[lang] }}</label>
                <input min="1" max="60" type="number" name="small-minutes" id="small-minutes" v-model="configMins.short">
            </div>
            <div class="setting-timer">
                <label for="long-minutes">{{ timerLanguages.field_settings_long[lang] }}</label>
                <input min="1" max="60" type="number" name="long-minutes" id="long-minutes" v-model="configMins.long">
            </div>
        </div>

        <div class="pomodoro-timer-settings-footer">
            <img @click="changeSettings()" src="/icons/tick.svg" alt="Tick Icon">
        </div>
    </div>
    <div class="pomodoro-timer">
        <div class="pomodoro-timer-head">
            <button data-type="1" aria-label="Pomodoro Timer Mode" @click="changeMode(1, $event)" :class="selectedMode == 1 ? 'selected' : ''">{{ timerLanguages.field_pomodoro[lang] }}</button>
            <button data-type="2" aria-label="Short Break Mode" @click="changeMode(2, $event)" :class="selectedMode == 2 ? 'selected' : ''">{{ timerLanguages.field_short_break[lang] }}</button>
            <button data-type="3" aria-label="Long Break Mode" @click="changeMode(3, $event)" :class="selectedMode == 3 ? 'selected' : ''">{{ timerLanguages.field_long_break[lang]}}</button>
            <span aria-hidden="true" class="modeLine"></span>
        </div>
        <div class="pomodoro-timer-body">
            <p>{{ timeLeft }}</p>
        </div>

        <div class="pomodoro-timer-footer">

            <button aria-label="Config Timer" @click="settingsState = true;">
                <img src="@/assets/icons/settings.svg" alt="Config timer Icon">
            </button>
            <button aria-label="Start or Pause Timer" @click="changeChronState(); sound()">{{ isActive ? timerLanguages.field_timer_state_stop[lang] : timerLanguages.field_timer_state_start[lang] }}</button>
            <button aria-label="Restart timer" @click="generateNewChron()">
                <img src="@/assets/icons/Restart.svg" alt="Restart timer Icon">
            </button>
        </div>
    </div>
</template>

<style>

.pomodoro-timer-settings {
    position: absolute;
    width: 95%;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    z-index: 2;
    background-color: rgb(223, 129, 129);
    border: 1px solid var(--darkBlue);
    transform: translate(-50%, -50%);
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0px 0px 7px 4px rgba(169, 67, 56, 0.24);
    max-width: 30rem;
    z-index: 98;
}

.pomodoro-timer-settings-head h2 {
    color: var(--darkBlueText);
    font-weight: bold;
    letter-spacing: 2px;
}

.pomodoro-timer-settings-head p {
    color: var(--darkBlueText);
    opacity: .55;
}

.pomodoro-timer-settings-body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.setting-timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.pomodoro-timer-settings-body input::-webkit-inner-spin-button,
.pomodoro-timer-settings-body input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.pomodoro-timer-settings-body input:focus-within,
.pomodoro-timer-settings-body input:focus-visible,
.pomodoro-timer-settings-body input:focus {
    outline: transparent;
}

.pomodoro-timer-settings-body input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--darkBlueText);
    color: var(--darkBlue);
    font-size: 1.3rem;
    width: 50%;
    text-align: center;
}

.pomodoro-timer-settings-body label {
    font-size: 1.4rem;
    color: var(--darkBlueText);
}

.pomodoro-timer-settings-footer img {
    width: 48px;
    background-color: var(--darkBlueText);
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

html[data-theme=dark] .pomodoro-timer-settings {
    background-color: #202D39;
    box-shadow: 0px 0px 7px 4px rgba(147, 212, 197, 0.06);
}

html[data-theme=dark] .pomodoro-timer-settings-head h2 {
    color: var(--lightWhite);
}

html[data-theme=dark] .pomodoro-timer-settings-body input {
    border-bottom-color: var(--lightRed);
    color: var(--lightBlue);
}

html[data-theme=dark] .pomodoro-timer-settings-body label {
    color: var(--lightWhite);
}

.pomodoro-timer button:active {
    filter: opacity(.75);
    scale: .95;
    transition: filter .1s ease;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.pomodoro-timer {
    background-color: var(--lightRed);
    max-width: 50rem;
    width: 95%;
    margin: 2rem auto;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0px 0px 7px 4px rgba(169, 67, 56, 0.24);
}

.pomodoro-timer-head {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.pomodoro-timer-head .modeLine {
    height: 2px;
    background-color: var(--lightBlue);
    position: absolute;
    left: .5rem;
    bottom: 0;
}

.pomodoro-timer-head button {
    background-color: transparent;
    border: none;
    color: var(--darkBlueText);
    font-size: .9rem;
    font-weight: 400;
    position: relative;
    cursor: pointer;
    font-size: .7rem;
}

.pomodoro-timer-body {
    text-align: center;
    margin: 3.5rem auto 0;
    font-size: 4rem;
    color: var(--darkBlueText);
}

.pomodoro-timer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pomodoro-timer-footer button {
    border-radius: 11px;
    border: none;
    height: 2.5rem;
    width: 2.5rem;
    background-color: rgba(255, 255, 237, 0.45);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.pomodoro-timer-footer button:nth-child(2) {
    width: 8rem;
    height: 3rem;
    max-height: 3rem;
    font-weight: 400;
    color: var(--darkBlueText);
    font-size: 1.3rem;
    box-shadow: 0px 4px 12px 4px rgba(0, 0, 0, 0.25);
}

.pomodoro-timer-footer button img {
    width: 24px;
    height: 24px;
}

.pomodoro-timer-head .selected {
    font-weight: 600;
}

@media screen and (min-width: 450px) {
    .pomodoro-timer-head button {
        font-size: 1rem;
    }
}

html[data-theme=dark] .pomodoro-timer {
    background-color: var(--darkBlue);
    box-shadow: 0px 0px 7px 4px rgba(147, 212, 197, 0.06);
}

html[data-theme=dark] .modeLine {
    background-color: var(--lightRed);
}
html[data-theme=dark] .pomodoro-timer button,
html[data-theme=dark] .pomodoro-timer p {
    color: var(--lightWhite);
}

html[data-theme=dark] .pomodoro-timer-footer button {
    background-color: #202D39;
}

html[data-theme=dark] .pomodoro-timer-footer button:nth-child(2) {
    background-color: rgba(255, 255, 237, 0.43);
}

html[data-theme=dark] .pomodoro-timer-footer button img {
    filter: invert(1);
}


</style>