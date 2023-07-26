<script setup>

import PomodoroTimer from '@/components/timer/pomodoro.vue';
import Tasks from '@/components/tasks/tasks.vue';
import { toRefs } from 'vue';

const props = defineProps({
  lang: String
})
const { lang } = toRefs(props);
</script>

<template>
  <main>
    <PomodoroTimer :lang="lang" />
    <Tasks :lang="lang" />
  </main>
</template>
