<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

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
</script>

<template>
    <button aria-label="Change Theme" class="change-theme-button" @click="setDark()">
        <img :src="`/icons/${icon}.svg`" :alt="`${icon} Icon`">
    </button>
    <header class="header">

        <div class="header-cont">

            <div class="leftLinks">
    
                <div class="links">
                    <img src="@/assets/icons/clock.svg" alt="Clock Icon">
                    <a href="#">Timer</a>
                </div>
    
                <div class="links">
                    <img src="@/assets/icons/task-list.svg" alt="Task list Icon">
                    <a href="#">Projects</a>
                </div>
    
            </div>
            
            <div class="logo">
                <img src="@/assets/socials/simple-logo.png" alt="PomoTimed Logo">
                <p>PomoTimed</p>
            </div>
    
            <div class="rightLinks">
    
                <div class="links">
                    <img src="@/assets/icons/faq.svg" alt="F.A.Q Icon">
                    <a href="#">F.A.Q</a>
                </div>
    
                <div class="links">
                    <img src="@/assets/icons/user.svg" alt="User Icon">
                    <a href="#">Log in</a>
                </div>
                
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
}


</style>