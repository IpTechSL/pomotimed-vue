<script setup>
import { RouterLink } from 'vue-router';

</script>
<template>
    <footer>
        <div class="footer-cont">
            <div class="footer-cont-cookies">
                <RouterLink to="/cookies">
                    <img src="@/assets/icons/cookies.png" alt="Cookies simbol">
                    Cookies
                </RouterLink>
            </div>
            <div class="footer-cont-legal">
                <RouterLink to="/legal">
                    <img src="@/assets/icons/legal.png" alt="Legal information simbol">
                </RouterLink>
            </div>
        </div>
    </footer>
</template>

<style scoped>


.footer-cont {
    width: 90%;
    margin: 1rem auto;
    display: flex;
    justify-content: space-between;
    color: var(--darkBlueText);
}

.footer-cont-legal {
    filter: invert(1);
}

.footer-cont-cookies a {
    display: flex;
    align-items: center;
    gap: .25rem;
    text-decoration: none;
    color: var(--darkBlueText);
}

html[data-theme=dark] * {
    color: var(--lightWhite);
    filter: none;
}

</style>