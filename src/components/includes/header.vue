<script setup>
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { onMounted, ref, watch, provide } from 'vue';
import anime from 'animejs';
import router from '../../router';

let dark = ref(false);

const route = useRoute();
let user = ref(route.params.user);

watch(route, async () => {
    user.value = route.params.user;
})

// Toggle theme function.
function toggleTheme() {

    document.documentElement.dataset.theme = dark.value ? 'light' : 'dark';
    dark.value = !dark.value;
    localStorage.setItem('darkMode', dark.value);
}


// Get navar links
let links = ref([]);
axios({
    method: "GET",
    url: "/services/navar.json",
})
.then(response => links.value = response.data)

// Get language from navigator and apply to the document
const navLang = navigator.language.split("-");
document.documentElement.lang = navLang[0];

// Get all avalaible  languages, check if navigator language it's in the avalaible languages.
// If avalaible, keep it, if not swap to English.
let lang = ref('en');
let languages = ref();
const hasLoaded = ref(false);
axios({
    method: "GET",
    url: "https://drupal.pomotimed.com/pomotimed/languages",
    auth: {
        username: "admin",
        password: "admin"
    }
})
.then(response => {
    languages.value = response.data;
    lang.value = languages.value[navLang[0]] ? navLang[0] : 'en';
    document.documentElement.lang = lang.value;
    hasLoaded.value = true;
})

// Show language selector.
const showLangSelector = ref(false);

const emit = defineEmits(["lang"]);

// Change Language function.
function changeLang(event) {
    lang.value = event.target.dataset.value;
    document.documentElement.lang = lang.value;
    emit("lang", lang);
}
// On mounted emit the language.
onMounted(() => {
    emit('lang', lang);
    
    try {
        dark.value = JSON.parse(localStorage.getItem("darkMode"));
        document.documentElement.dataset.theme = dark.value ? 'dark' : 'light';
    } catch (error) {
        
    }
})

watch(lang, async () => {
    emit('lang', lang)
})

// Check if menu mobile it's active and animation declaration.
let menuMobile = ref(false);
function animMobile() {
    
    const duration = 100;
    
    if(menuMobile.value) {
        document.body.style.overflow = "auto";

        anime({
            targets: ".mobile-menu-body nav ul li",
            left: "-10px",
            bottom: "-10px",
            opacity: 0,
        })
        
        anime({
            targets: ".mobile-menu",
            duration: duration,
            easing: "linear",
            width: 0,
            height: 0,
            borderRadius: "0px 0px 0px 100px",
            complete: () => {
                document.querySelector(".mobile-menu").style.display = "none";
            }
        })

        anime({
            targets: ".hamburguer-mobile div:nth-child(1)",
            top: {
                delay: 100,
                value: "0rem"
            },
            rotate: 0,
            duration: duration,
            easing: "easeInOutElastic"
        })
    
        anime({
            targets: ".hamburguer-mobile div:nth-child(2)",
            opacity: {
                delay: 200,
                value: 1
            },
            duration: 800
        })
        
        anime({
            targets: ".hamburguer-mobile div:nth-child(3)",
            width: {
                delay: 100,
                value: 22
            },
            bottom: {
                delay: 100,
                value: "0rem"
            },
            rotate: 0,
            duration: duration,
            easing: "easeInOutElastic"
        })

    } else {
        document.body.style.overflow = "hidden";
        anime({
            targets: ".mobile-menu-body nav ul li",
            opacity: 1,
            easing: "linear",
            left: 0,
            bottom: 0,
            delay: anime.stagger(10),
            duration: 500
        })

        anime({
            targets: ".mobile-menu",
            right: 0,
            easing: "easeInQuart",
            height: [{
                delay: 50,
                value: "100vh"
            }],
            width: [{
                delay: 0,
                value: "100vw"
            }],
            borderRadius: {
                delay: 50,
                value: "0px 0px 0px 0px"
            },
            duration: 150,
            begin: () => {
                document.querySelector(".mobile-menu").style.display = "flex";
            }
        })

        anime({
            targets: ".hamburguer-mobile div:nth-child(1)",
            top: "0.6rem",
            rotate: {
                delay: 400,
                value: 45
            },
            duration: duration,
            easing: "easeInOutElastic"
        })
    
        anime({
            targets: ".hamburguer-mobile div:nth-child(2)",
            opacity: 0,
            duration: 800,
            endDelay: 1000
        })
        
        anime({
            targets: ".hamburguer-mobile div:nth-child(3)",
            width: 30,
            bottom: "0.6rem",
            rotate: {
                delay: 400,
                value: -45
            },
            duration: duration,
            easing: "easeInOutElastic"
        })
    }


    menuMobile.value = !menuMobile.value;
}


// Temporary Log out function.
function logOut() {
    localStorage.removeItem('jwt');
    router.push('/');
}
</script>

<template>
    <button style="position: absolute; top: 7rem; left: 3rem; opacity: .25;" @click="logOut()">Cerrar sesión</button>
    <header class="header">
    
        
        <div class="header-cont">

            <div class="header-buttons" v-if="hasLoaded">
                <button class="lang-selector" @click="showLangSelector = !showLangSelector">
                    <p class="lang-selector-selected"><img style="width: 32px;" :src="`/icons/lang/${lang}.png`" :alt="lang + 'language'"></p> 
                    <ul v-if="showLangSelector">
            
                        <template v-for="language in languages">
                            
                            <li v-if="language.short != lang" @click="changeLang($event)" :data-value="language.short">
                                <img style="width: 32px;" :src="`/icons/lang/${language.short}.png`" :alt="language.desc[lang]">
                            </li>
            
                        </template>
            
                    </ul>
                </button>
            
            
                <button aria-label="Change Theme" class="change-theme-button" @click="toggleTheme()">
                    <img v-if="dark" :src="`/icons/sun.svg`" :alt="`Sun Icon`">
                    <img v-else-if="!dark" :src="`/icons/moon.svg`" :alt="`Moon Icon`">
                </button>
            </div>

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
                <RouterLink to="/">
                    <img src="@/assets/socials/simple-logo.png" alt="PomoTimed Logo">
                    <p>PomoTimed</p>
                </RouterLink>
            </div>
    
            <div class="rightLinks">
                <template v-for="link in links" class="links">
                    <template v-if="link.icon == 'faq' || link.icon == 'user'">
                        <div v-if="link.title.en == 'Log in' && !user.uid || link.icon == 'faq'" class="links">
                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                            <RouterLink :to="{path: link.link}">{{ link.title[lang] }}</RouterLink>
                        </div>
                        <div style="order: 2;" v-else-if="link.title.en == 'Profile' && user.uid" class="links">
                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                            <RouterLink :to="{path: link.link}">{{ link.title[lang] }}</RouterLink>
                        </div>
                    </template>
                </template>
            </div>

            <div class="header-cont-buttonMobile">
                <button class="hamburguer-mobile" @click="animMobile()">
                    <div></div>
                    <div></div>
                    <div></div>
                </button>
            </div>

            <div class="mobile-menu">

                <div class="mobile-menu-body">
                    <nav>
                        <ul>
                            <template v-for="link in links">
                                <template v-if="link.icon == 'user'">
                                    <template v-if="!user.uid && link.title.en == 'Log in'">
                                        <li style="order: -1;">
                                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                                            <RouterLink @click="animMobile()" v-if="!user.uid && link.title.en == 'Log in'" :to="{path: link.link}">
                                                {{ link.title[lang] }}
                                            </RouterLink>
                                        </li>
                                    </template>
                                        <template v-else-if="user.uid && link.title.en != 'Log in'">
                                            <li>
                                                <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                                                <RouterLink @click="animMobile()" :to="{path: link.link}">
                                                    {{ link.title[lang] }}
                                                </RouterLink>
                                            </li>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <li>
                                            <img :src="`/icons/${link.icon}.svg`" :alt="link.title[lang] + ' Icon'">
                                            <RouterLink @click="animMobile()" :to="{path: link.link}">
                                                {{ link.title[lang] }}
                                            </RouterLink>
                                        </li>
                                    </template>
                            </template>
                        </ul>
                    </nav>
                </div>  
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

.header-cont-buttonMobile {
    z-index: 3;
    flex: 1;
    display: flex;
    justify-content: flex-end;
}

.hamburguer-mobile {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    align-items: end;
    background-color: transparent;
    border: none;
    z-index: 3;
}

.hamburguer-mobile div {
    height: 2px;
    background-color: var(--darkBlueText);
    display: block;
    position: relative;
    border-radius: 10px;
}

.hamburguer-mobile div:nth-child(1) {
    width: 30px;
}

.hamburguer-mobile div:nth-child(2) {
    width: 15px;
}

.hamburguer-mobile div:nth-child(3) {
    width: 22px;
}

.mobile-menu {
    transition: all .25s;
    position: absolute;
    background-color: var(--lightWhite);
    height: 0;
    width: 0;
    top: 0;
    right: 0;
    z-index: 1;
    display: none;
    border-radius: 0px 0px 0px 100px;
    justify-content: center;
    gap: 3rem;
    align-items: center;
    flex-direction: column;
}


.mobile-menu-head {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 90%;
}

.mobile-menu-body {
    width: 100%;
}

.mobile-menu-body ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    gap: 2rem;
}

.mobile-menu-body ul li {
    opacity: 0;
    position: relative;
    left: -10px;
    bottom: -10px;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: flex-start;
}

.mobile-menu-body ul li a {
    color: var(--lightRed);
    text-decoration: none;
    
}

.mobile-menu-body ul li::after {
    content: "";
    display: block;
    width: 100%;
    background-color: var(--darkGrey);
    height: 1px;
    opacity: .25;
    position: absolute;
    bottom: -1rem;
    left: 0;
}

.mobile-menu-body ul li img {
    width: 32px;
    margin-left: 2rem;
    object-fit: cover;
}

html[data-theme=dark] .mobile-menu {
    background-color: var(--darkBlueHF);
}

html[data-theme=dark] .hamburguer-mobile div {
    background-color: var(--lightRed);
}

html[data-theme=dark] .mobile-menu-body a {
    color: var(--lightBlue);
}

html[data-theme=dark] .mobile-menu-body img {
    filter: invert(1);
}

.logo {
    display: none;
}

.header-cont {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    max-width: 40rem;
    justify-content: space-between;
}

.header-buttons {
    display: flex;
    gap: 1rem;
    flex: 1;
}

.leftLinks,
.rightLinks {
    display: none;
}

@media screen and (min-width: 300px) {
    .logo {
        flex: 2;
        display: flex;
        align-items: center;
        z-index: 3;
        position: relative;
        display: flex;
        justify-content: center;
    }

    .logo .router-link-exact-active {
        border-bottom: none !important;
    }
}

.logo img {
    width: 72px;
}

.logo p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    color: var(--darkBlueText);
}

.hamburguer-mobile svg path {
    fill: var(--darkBlueText);
}

.change-theme-button {
    right: 1rem;
    top: 1rem;
    background-color: transparent;
    border: none;
    order: -1;
    display: flex;
    align-items: center;
    cursor: pointer;
}
    
.lang-selector {
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

    .header-buttons {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
    }

    .header-cont-buttonMobile {
        display: none;
    }

    .change-theme-button,
    .lang-selector {
        position: absolute;
    }

    .mobile-menu {
        display: none !important;
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
    }

    .lang-selector {
        display: block;
        position: absolute;
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

.router-link-exact-active {
    border-bottom: 1px solid var(--darkBlueHF);
}

html[data-theme=dark] .router-link-exact-active {
    border-color: var(--lightRed);
}

</style>