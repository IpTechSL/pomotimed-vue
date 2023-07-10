<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { onMounted, ref } from 'vue';

let icon = ref("moon");
let dark = true;
function setDark() {
    if(!dark) {
        icon.value = 'moon';
        document.documentElement.dataset.theme = 'light';
    } else {
        icon.value = 'sun';
        document.documentElement.dataset.theme = 'dark';
    }

    dark = !dark;
}



let links = ref([]);
axios({
    method: "GET",
    url: "https://drupal.pomotimed.com/pomotimed/menu/navar",
    auth: {
        username: "admin",
        password: "admin"
    }
})
.then(response => links.value = response.data)

const navLang = navigator.language.split("-");
document.documentElement.lang = navLang[0]
const lang = ref(document.documentElement.lang);
const auth = false;
const showLangSelector = ref(false);

const emit = defineEmits(["lang"]);

function changeLang(event) {
    lang.value = event.target.dataset.value;
    document.documentElement.lang = lang.value;
    emit("lang", lang)
}


let languages = ref();
axios({
    method: "GET",
    url: "https://drupal.pomotimed.com/pomotimed/languages",
    auth: {
        username: "admin",
        password: "admin"
    }
})
.then(response => languages.value = response.data)

onMounted(() => {
    emit('lang', lang);
})
</script>

<template>

    <header class="header">
    
        <button class="lang-selector" @click="showLangSelector = !showLangSelector">
            <p class="lang-selector-selected">{{ lang.toUpperCase() }} <img style="width: 32px;" :src="`/icons/lang/${lang}.png`" :alt="lang + 'language'"></p> 
            <ul v-if="showLangSelector">
    
                <template v-for="language in languages">
                    
                    <li @click="changeLang($event)" :data-value="language.short">
                        {{ language.short.toUpperCase() }} <img style="width: 32px;" :src="`/icons/lang/${language.short}.png`" :alt="language.desc[lang]">
                    </li>
    
                </template>
    
            </ul>
        </button>
    
    
        <button aria-label="Change Theme" class="change-theme-button" @click="setDark()">
            <img :src="`/icons/${icon}.svg`" :alt="`${icon} Icon`">
        </button>

        <div class="header-cont">

            <div class="leftLinks">
                <template v-for="link in links" class="links">
                    <template v-if="link.icon == 'time'">
                        <div class="links">
                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                            <RouterLink :to="{path: '/'}">{{ link.title[lang] }}</RouterLink>
                        </div>
                    </template>
                    <template v-if="link.icon == 'project'">
                        <div class="links">
                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                            <RouterLink :to="{path: link.link}">{{ link.title[lang] }}</RouterLink>
                        </div>
                    </template>
                </template>
            </div>

            <div class="logo">
                <img src="@/assets/socials/simple-logo.png" alt="PomoTimed Logo">
                <p>PomoTimed</p>
            </div>
    
            <div class="rightLinks">
                <template v-for="link in links" class="links">
                    <template v-if="link.icon == 'faq' || link.icon == 'user'">
                        <div v-if="link.title.en == 'Login' && !auth || link.icon == 'faq'" class="links">
                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                            <RouterLink :to="{path: link.link}">{{ link.title[lang] }}</RouterLink>
                        </div>
                        <div style="order: 2;" v-else-if="link.title.en == 'Profile' && auth" class="links">
                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                            <RouterLink :to="{path: link.link}">{{ link.title[lang] }}</RouterLink>
                        </div>
                    </template>
                </template>
            </div>

            <div class="hamburguer-mobile">
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.67076 23.9987L30.1937 23.9987C32.6021 24.0692 32.6021 21.2607 30.1937 21.3312L7.76053 21.3312C5.39592 21.2607 5.30396 23.9987 7.66857 23.9987H7.67076ZM30.1937 13.3322C32.5101 13.3322 32.5101 10.6665 30.1937 10.6665L17.4949 10.6665C15.1302 10.6665 15.1302 13.3322 17.4949 13.3322L30.1937 13.3322ZM30.1937 2.66578C32.5101 2.66578 32.5101 0 30.1937 0L1.73733 0C-0.579113 0 -0.579113 2.66578 1.73733 2.66578L30.1937 2.66578Z" fill="#93D4C5"/>
                </svg>
            </div>

        </div>

    </header>
</template>

<style>

header {
    background-color: var(--lightBlue);
    padding: 1rem 0;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    transition: all .25s ease;
}

.header-cont {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    max-width: 40rem;
    justify-content: space-between;
}

.leftLinks,
.rightLinks {
    display: none;
}

.logo {
    display: flex;
    align-items: center;
}

.logo p {
    color: var(--darkBlueText);
    font-size: 1.2rem;
}

.logo img {
    width: 54px;
}

.hamburguer-mobile svg path {
    fill: var(--darkBlueText);
}

.change-theme-button {
    display: none;
    position: absolute;
    right: 1rem;
    top: 1rem;
    background-color: transparent;
    border: none;
}

.lang-selector {
    display: none;
}

html[data-theme=dark] body {
    background-color: var(--darkGrey);
}

html[data-theme=dark] .logo p {
    color: var(--lightWhite);
}

html[data-theme=dark] .hamburguer-mobile svg path {
    fill: var(--lightBlue);
}

html[data-theme=dark] header {
    background-color: var(--darkBlueHF);
}






@media screen and (min-width: 650px) {
    
    header {
        background-color: transparent !important;
        box-shadow: none;
        padding: 2rem 0;
    }

    .header-cont {
        width: 80%;
    }


    .logo {
        position: relative;
        flex: .5;
        display: flex;
        justify-content: center;
    }

    .logo img {
        width: 72px;
    }

    .logo p {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
    }

    .leftLinks,
    .rightLinks {
        display: flex;
        flex: 1;
        justify-content: space-around;
        text-align: center;
    }

    .links {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    .links img {
        width: 32px;
    }

    .links a {
        color: var(--lightRed);
        text-decoration: none;
    }

    .hamburguer-mobile {
        display: none;
    }

    html[data-theme=dark] .links img {
        filter: invert(1);
    }

    html[data-theme=dark] .links a {
        color: var(--lightBlue);
    }

    .change-theme-button {
        display: block;
        cursor: pointer;
    }

    .lang-selector {
        display: block;
        position: absolute;
        top: 1rem;
        left: .5rem;
        background-color: transparent;
        border: 1px solid var(--lightRed);
        border-radius: 5px;
        padding: .25rem;
        font-size: .7rem;
        cursor: pointer;
    }

    .lang-selector p {
        display: flex;
        align-items: center;
        gap: .5rem;
        padding: .2rem;
    }
    
    .lang-selector p img {
        border-radius: 2px;
        height: 16px;
    }
    
    .lang-selector ul {
        margin-top: 1rem;
        padding: 0;
        list-style: none;
        outline: 1px solid var(--lightRed);
        outline-offset: .25rem;
        border-radius: 0 0 2px 2px;
    }

    .lang-selector ul {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .lang-selector ul li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        transition: all .25s;
        padding: .2rem;
    }

    .lang-selector ul li:hover {
        background-color: rgb(218, 211, 211);
        border-radius: 5px;
        scale: .95;
    }

    .lang-selector ul li img {
        width: 32px;
        object-fit: cover;
        border-radius: 2px;
        pointer-events: none;
    }

    html[data-theme=dark] .lang-selector {
        color: var(--lightWhite);
    }

    html[data-theme=dark] .lang-selector ul li:hover{
        color: var(--darkBlueHF);
    }
}

@media screen and (min-width: 850px) {
    .header-cont {
        width: 90%;
    }
}


</style>