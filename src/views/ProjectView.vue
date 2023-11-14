<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const projectID = route.params.projectID
</script>
<template>
    <h1>{{ projectID }}</h1>
</template>