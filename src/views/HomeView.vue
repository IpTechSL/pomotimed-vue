<script setup>

import PomodoroTimer from '@/components/timer/pomodoro.vue';
import Tasks from '@/components/tasks/tasks.vue';
import { inject } from 'vue';

const lang = inject("lang");
</script>

<template>
  <main>
    <PomodoroTimer />
    <Tasks />
  </main>
</template>
