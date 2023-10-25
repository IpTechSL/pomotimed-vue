<script setup>
import { provide, inject } from 'vue';
import Invite from './invite.vue';
import Leave from './leave.vue'


// Get props.
const props = defineProps({
    type: String,
    projectId: String
})

provide('projectId', props.projectId);
const { setShowModal } = inject("showModal");

function shouldClose(event) {
    event.target.classList.contains('modal-holder') ? setShowModal(false) : null;
}
</script>
<template>
    <Teleport to="body">
        <div class="modal-holder" @click="shouldClose($event)">
            <div class="modal">
                <img v-if="props.type != 'leave'" src="/icons/cross.svg" alt="Cross icon" @click="setShowModal(false)">
                <Invite v-if="props.type === 'invite'" />
                <Leave  v-if="props.type === 'leave'"/>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal-holder {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(199, 199, 199, 0.445);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    background-color: rgb(255, 110, 110);
    padding: 2rem;
    border-radius: 5px;
    color: var(--darkBlueText);
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

html[data-theme=dark] .modal {
    background-color: var(--darkBlue);
    color: var(--lightWhite);
}

.modal img {
    border-radius: 2px;
    height: 28px;
    width: 28px;
    filter: grayscale(1);
    place-self: flex-end;
}

</style>